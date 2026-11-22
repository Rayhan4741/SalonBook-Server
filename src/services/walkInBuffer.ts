export function isSlotReservedForWalkIns(slotIndex: number, totalSlots: number): boolean {
  return slotIndex === totalSlots - 1; // Last slot reserved for walk-ins
}
