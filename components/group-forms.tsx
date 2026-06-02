import Link from "next/link";
import { createGroup, joinGroup } from "@/app/actions";

type GroupFormLabels = {
  groupName: string;
  groupNamePlaceholder: string;
  displayName: string;
  displayNamePlaceholder: string;
  createGroup: string;
  inviteCode: string;
  inviteCodePlaceholder: string;
  joinGroup: string;
  noGroupsYet: string;
  noGroupsCopy: string;
  openGroup: string;
};

type GroupFormProps = {
  labels: GroupFormLabels;
  defaultDisplayName?: string;
  displayNameFieldId?: string;
};

export function CreateGroupForm({
  labels,
  defaultDisplayName,
  displayNameFieldId = "create-displayName",
}: GroupFormProps) {
  return (
    <form action={createGroup} className="space-y-4">
      <div>
        <label className="text-sm font-medium text-slate-700" htmlFor="name">
          {labels.groupName}
        </label>
        <input
          className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-ink outline-none ring-0 transition placeholder:text-slate-400 focus:border-pitch-500"
          id="name"
          name="name"
          placeholder={labels.groupNamePlaceholder}
          required
          type="text"
        />
      </div>

      <div>
        <label
          className="text-sm font-medium text-slate-700"
          htmlFor={displayNameFieldId}
        >
          {labels.displayName}
        </label>
        <input
          className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-ink outline-none ring-0 transition placeholder:text-slate-400 focus:border-pitch-500"
          id={displayNameFieldId}
          name="displayName"
          placeholder={labels.displayNamePlaceholder}
          defaultValue={defaultDisplayName}
          required
          type="text"
        />
      </div>

      <button
        className="inline-flex w-full items-center justify-center rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        type="submit"
      >
        {labels.createGroup}
      </button>
    </form>
  );
}

export function JoinGroupForm({
  labels,
  defaultDisplayName,
  displayNameFieldId = "join-displayName",
}: GroupFormProps) {
  return (
    <form action={joinGroup} className="space-y-4">
      <div>
        <label className="text-sm font-medium text-slate-700" htmlFor="inviteCode">
          {labels.inviteCode}
        </label>
        <input
          className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm uppercase tracking-[0.25em] text-ink outline-none ring-0 transition placeholder:tracking-normal focus:border-pitch-500"
          id="inviteCode"
          maxLength={6}
          name="inviteCode"
          placeholder={labels.inviteCodePlaceholder}
          required
          type="text"
        />
      </div>

      <div>
        <label
          className="text-sm font-medium text-slate-700"
          htmlFor={displayNameFieldId}
        >
          {labels.displayName}
        </label>
        <input
          className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-ink outline-none ring-0 transition placeholder:text-slate-400 focus:border-pitch-500"
          id={displayNameFieldId}
          name="displayName"
          placeholder={labels.displayNamePlaceholder}
          defaultValue={defaultDisplayName}
          required
          type="text"
        />
      </div>

      <button
        className="inline-flex w-full items-center justify-center rounded-full border border-ink/10 bg-white px-5 py-3 text-sm font-semibold text-ink transition hover:bg-slate-50"
        type="submit"
      >
        {labels.joinGroup}
      </button>
    </form>
  );
}

export function EmptyGroupsState({ labels }: { labels: GroupFormLabels }) {
  return (
    <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white/50 p-8 text-center">
      <p className="text-lg font-semibold text-ink">{labels.noGroupsYet}</p>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        {labels.noGroupsCopy}
      </p>
    </div>
  );
}

export function GroupLink({ groupId, label }: { groupId: string; label: string }) {
  return (
    <Link
      className="inline-flex items-center rounded-full bg-pitch-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-pitch-800"
      href={`/groups/${groupId}`}
    >
      {label}
    </Link>
  );
}
