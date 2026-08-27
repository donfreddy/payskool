import {
  createSupportTicket,
  fetchSupportTickets,
  type FakeSupportTicket,
  type TicketCategory,
} from "@/core/mocks/support-db";

export function listSupportTickets(schoolId: string): Promise<FakeSupportTicket[]> {
  return fetchSupportTickets(schoolId);
}

export function addSupportTicket(
  schoolId: string,
  input: { subject: string; category: TicketCategory },
): Promise<FakeSupportTicket> {
  return Promise.resolve(createSupportTicket(schoolId, input));
}