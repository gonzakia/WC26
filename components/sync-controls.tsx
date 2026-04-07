import { syncWorldCupData } from "@/app/actions";

export function SyncWorldCupButton() {
  return (
    <form action={syncWorldCupData}>
      <button
        className="inline-flex items-center justify-center rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        type="submit"
      >
        Sync fixtures and results now
      </button>
    </form>
  );
}
