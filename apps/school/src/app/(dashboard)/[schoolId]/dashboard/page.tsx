import { FAKE_METRICS, FAKE_RECENT_PAYMENTS, FAKE_LIVE_FEED, FAKE_USER } from "@/core/mocks/fake-data";
import { Card, CardContent, CardHeader, CardTitle } from "@payskool/ui/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@payskool/ui/components/ui/table";
import { Badge } from "@payskool/ui/components/ui/badge";
import { Button } from "@payskool/ui/components/ui/button";
import { Home, Download, Plus } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";

export default function DashboardPage() {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XAF",
      minimumFractionDigits: 0,
    }).format(amount).replace("XAF", "FCFA");
  };

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        breadcrumbs={[
          { label: "Vue d'ensemble", icon: Home }
        ]}
        greetingName={FAKE_USER.name.split(' ')[0]}
        subtitle="Voici ce qui se passe dans votre établissement aujourd'hui."
        actions={
          <>
            <Button variant="inverted" className="shadow-sm h-9">
              <Download className="mr-2 h-4 w-4" /> Exporter
            </Button>
            <Button className="bg-[#059669] hover:bg-[#059669]/90 text-white shadow-sm h-9">
              <Plus className="mr-2 h-4 w-4" /> Nouveau règlement
            </Button>
          </>
        }
      />

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Recouvrement Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{formatCurrency(FAKE_METRICS.totalCollection)}</div>
            <p className="text-xs text-payskool-emerald mt-1 font-medium">+14% vs 2025</p>
          </CardContent>
        </Card>
        
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Taux de Recouvrement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{FAKE_METRICS.collectionRate}%</div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
              <div 
                className="h-full bg-payskool-emerald rounded-full" 
                style={{ width: `${FAKE_METRICS.collectionRate}%` }}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Reste à Encaisser</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{formatCurrency(FAKE_METRICS.remainingAmount)}</div>
          </CardContent>
        </Card>
        
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Élèves à Jour</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{FAKE_METRICS.studentsUpToDate} <span className="text-lg text-slate-400 font-normal">/ {FAKE_METRICS.totalStudents}</span></div>
            <p className="text-xs text-slate-500 mt-1">80% de la totalité</p>
          </CardContent>
        </Card>
      </div>

      {/* 2 Columns Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (70%) */}
        <div className="lg:col-span-2">
          <Card className="border-slate-200 shadow-sm h-full">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-semibold text-slate-900">Derniers Encaissements</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Élève</TableHead>
                    <TableHead>Classe</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Méthode</TableHead>
                    <TableHead>Reçu</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {FAKE_RECENT_PAYMENTS.map((txn) => (
                    <TableRow key={txn.id}>
                      <TableCell className="font-medium text-slate-900">{txn.student}</TableCell>
                      <TableCell className="text-slate-500">{txn.class}</TableCell>
                      <TableCell className="font-medium">{formatCurrency(txn.amount)}</TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={
                            txn.method.includes("Orange") ? "bg-orange-50 text-orange-700 border-orange-200" :
                            txn.method.includes("MTN") ? "bg-yellow-50 text-yellow-700 border-yellow-200" :
                            txn.method.includes("Wave") ? "bg-cyan-50 text-cyan-700 border-cyan-200" :
                            "bg-slate-50 text-slate-700 border-slate-200"
                          }
                        >
                          {txn.method}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-500 text-sm">{txn.receipt}</TableCell>
                      <TableCell>
                        <Badge className="bg-payskool-emerald/10 text-payskool-emerald hover:bg-payskool-emerald/20 border-0 shadow-none">
                          {txn.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="text-payskool-emerald hover:text-payskool-emerald hover:bg-payskool-emerald/10">
                          Voir
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Right Column (30%) */}
        <div>
          <Card className="border-slate-200 shadow-sm h-full">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-semibold text-slate-900">Activité Caisse en Direct</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {FAKE_LIVE_FEED.map((feed, index) => (
                  <div key={feed.id} className="relative pl-6">
                    {/* Timeline line */}
                    {index !== FAKE_LIVE_FEED.length - 1 && (
                      <div className="absolute left-[9px] top-6 bottom-[-24px] w-px bg-slate-200" />
                    )}
                    {/* Timeline dot */}
                    <div className="absolute left-0 top-1.5 w-5 h-5 bg-payskool-emerald/10 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-payskool-emerald rounded-full" />
                    </div>
                    
                    <p className="text-sm text-slate-700 leading-snug">
                      {feed.message}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {feed.timeAgo}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
      </div>
    </div>
  );
}
