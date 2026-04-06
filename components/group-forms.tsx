import Link from "next/link";
import { createGroup, joinGroup } from "@/app/actions";

export function CreateGroupForm() {
  return (
    <form action={createGroup} className="space-y-4">
      <div>
        <label className="text-sm font-medium text-slate-700" htmlFor="name">
          Group name
        </label>
        <input
          className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-ink outline-none ring-0 transition placeholder:text-slate-400 focus:border-pitch-500"
          id="name"
          name="name"
          placeholder="Friday Friends"
          required
          type="text"
        />
      </div>

      <button
        className="inline-flex w-full items-center justify-center rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        type="submit"
      >
        Create group
      </button>
    </form>
  );
}

export function JoinGroupForm() {
  return (
    <form action={joinGroup} className="space-y-4">
      <div>
        <label className="text-sm font-medium text-slate-700" htmlFor="inviteCode">
          Invite code
        </label>
        <input
          className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm uppercase tracking-[0.25em] text-ink outline-none ring-0 transition placeholder:tracking-normal focus:border-pitch-500"
          id="inviteCode"
          maxLength={6}
          name="inviteCode"
          placeholder="WC26DE"
          required
          type="text"
        />
      </div>

      <button
        className="inline-flex w-full items-center justify-center rounded-full border border-ink/10 bg-white px-5 py-3 text-sm font-semibold text-ink transition hover:bg-slate-50"
        type="submit"
      >
        Join group
      </button>
    </form>
  );
}

export function EmptyGroupsState() {
  return (
    <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white/50 p-8 text-center">
      <p className="text-lg font-semibold text-ink">No groups yet</p>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        Create your first private league or join one with an invite code.
      </p>
    </div>
  );
}

export function GroupLink({ groupId }: { groupId: string }) {
  return (
    <Link
      className="inline-flex items-center rounded-full bg-pitch-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-pitch-800"
      href={`/groups/${groupId}`}
    >
      Open group
    </Link>
  );
}
