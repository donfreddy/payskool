"use client";

import { useEffect, useState } from "react";

import type { FakeStudent, FakeTx } from "@/core/mocks/fake-data";
import { FAKE_USER, MOCK_NOW } from "@/core/mocks/fake-data";
import { registerCaisse } from "@/core/mocks/students-db";
import {
  getDailyCaisse,
  getTodayTransactions,
  listStudents,
  persistReceipt,
  persistTransaction,
} from "@/features/cashier/api/cashier.mock";
import { CaisseDuJour } from "@/features/cashier/components/caisse-du-jour";
import { ConfirmDialog } from "@/features/cashier/components/confirm-dialog";
import { ReceiptTicket } from "@/features/cashier/components/receipt-ticket";
import { StudentLookup } from "@/features/cashier/components/student-lookup";
import { Workbench } from "@/features/cashier/components/workbench";
import type { ReceiptRecord, RegisterDraft, RegisterMethod } from "@/features/cashier/types";
import { allocateFIFO } from "@/lib/fees";

function parseAmount(raw: string): number {
  const digits = raw.replace(/\D/g, "");
  return digits ? parseInt(digits, 10) : 0;
}

const methodLabels: Record<RegisterMethod, string> = {
  CASH: "ESPÈCES",
  CHEQUE: "CHÈQUE",
};

let receiptSeq = 8957;

export function CashierStation({ schoolId }: { schoolId: string }) {
  const [students, setStudents] = useState<FakeStudent[]>([]);
  const [txns, setTxns] = useState<FakeTx[]>([]);
  const [caisse, setCaisse] = useState({ collected: 0, txCount: 0, byMethod: { CASH: 0, CHEQUE: 0 }, opener: "", float: 0 });
  const [loading, setLoading] = useState(true);
  const [loadingTxns, setLoadingTxns] = useState(true);

  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState<RegisterDraft>({ amount: "", method: "CASH", chequeNumber: "", chequeBank: "" });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [receipt, setReceipt] = useState<ReceiptRecord | null>(null);

  useEffect(() => {
    listStudents(schoolId).then((list) => {
      setStudents(list);
      setSelectedId(list[0]?.id ?? null);
      setLoading(false);
    });
    getDailyCaisse(schoolId).then((c) => setCaisse({ ...caisse, ...c }));
    getTodayTransactions(schoolId).then((t) => {
      setTxns(t);
      setLoadingTxns(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schoolId]);

  const selected = students.find((s) => s.id === selectedId) ?? null;

  const openConfirm = () => {
    if (parseAmount(draft.amount) <= 0) return;
    setConfirmOpen(true);
  };

  const confirmPayment = () => {
    if (!selected) return;
    const amount = parseAmount(draft.amount);
    const allocations = allocateFIFO(selected, amount).map((a) => ({
      ...a,
      label:
        selected.feePlan.installments.find((i) => i.id === a.installmentId)?.label ?? "Tranche",
    }));
    const method = draft.method;

    const number = `#REC-${receiptSeq++}`;
    const createdAt = MOCK_NOW.toISOString();
    const rec: ReceiptRecord = {
      id: `rec_${number.slice(1)}`,
      number,
      studentId: selected.id,
      studentName: `${selected.firstName} ${selected.lastName}`,
      classLevel: selected.classLevel,
      matricule: selected.matricule,
      amount,
      method,
      ...(method === "CHEQUE"
        ? { chequeNumber: draft.chequeNumber, chequeBank: draft.chequeBank }
        : {}),
      allocations,
      cashier: FAKE_USER.name,
      createdAt,
    };

    const txn: FakeTx = {
      id: `tx_gen_${Date.now()}`,
      studentId: selected.id,
      studentName: rec.studentName,
      classLevel: selected.classLevel,
      amount,
      method,
      receipt: `#${receiptSeq - 1}`,
      date: createdAt,
    };
    persistTransaction(txn);
    persistReceipt(rec);
    registerCaisse(amount, method);

    const byMethod =
      method === "CASH"
        ? { CASH: caisse.byMethod.CASH + amount, CHEQUE: caisse.byMethod.CHEQUE }
        : { CASH: caisse.byMethod.CASH, CHEQUE: caisse.byMethod.CHEQUE + amount };
    setCaisse((prev) => ({
      ...prev,
      byMethod,
      collected: prev.collected + amount,
      txCount: prev.txCount + 1,
    }));
    setTxns((prev) => [txn, ...prev.slice(0, 19)]);
    setConfirmOpen(false);
    setReceipt(rec);
    setDraft({ amount: "", method: "CASH", chequeNumber: "", chequeBank: "" });
  };

  const receiptAmount = parseAmount(draft.amount);
  const chequeContext =
    draft.method === "CHEQUE" && draft.chequeNumber
      ? `chèque n°${draft.chequeNumber}${draft.chequeBank ? " · " + draft.chequeBank : ""}`
      : draft.method === "CHEQUE"
        ? "chèque"
        : null;

  return (
    <div className="grid items-start gap-5 xl:grid-cols-12">
      <div className="space-y-5 xl:col-span-4">
        <StudentLookup
          students={students}
          loading={loading}
          query={query}
          onQueryChange={setQuery}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
        <CaisseDuJour
          collected={caisse.collected}
          txCount={caisse.txCount}
          byMethod={caisse.byMethod}
          txns={loadingTxns ? [] : txns}
        />
      </div>

      <div className="xl:col-span-8">
        {receipt ? (
          <ReceiptTicket receipt={receipt} onReset={() => setReceipt(null)} />
        ) : (
          <Workbench
            student={selected}
            draft={draft}
            onChangeDraft={(patch: Partial<RegisterDraft>) => setDraft((d) => ({ ...d, ...patch }))}
            onConfirm={openConfirm}
          />
        )}
      </div>

      <ConfirmDialog
        open={confirmOpen}
        student={selected}
        amount={receiptAmount}
        methodLabel={methodLabels[draft.method]}
        chequeContext={chequeContext}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={confirmPayment}
      />
    </div>
  );
}