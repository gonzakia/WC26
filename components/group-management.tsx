"use client";

import { Crown, LogOut, Trash2, UserMinus, Users } from "lucide-react";
import {
  deleteGroup,
  leaveGroup,
  removeGroupMember,
} from "@/app/actions";

type ManageableMember = {
  id: string;
  userId: string;
  role: string;
  name: string;
  isCurrentUser: boolean;
};

type GroupManagementLabels = {
  title: string;
  ownerTools: string;
  ownerToolsCopy: string;
  transferOwner: string;
  transferOwnerPlaceholder: string;
  removeMember: string;
  leaveGroup: string;
  deleteGroup: string;
  ownerBadge: string;
  youBadge: string;
  leaveWarning: string;
  removeWarning: string;
  deleteWarning: string;
};

type GroupManagementProps = {
  groupId: string;
  currentUserRole: string;
  members: ManageableMember[];
  labels: GroupManagementLabels;
};

function confirmWarning(message: string) {
  return window.confirm(message);
}

export function GroupManagement({
  groupId,
  currentUserRole,
  members,
  labels,
}: GroupManagementProps) {
  const isOwner = currentUserRole === "OWNER";
  const currentMember = members.find((member) => member.isCurrentUser);
  const otherMembers = members.filter((member) => !member.isCurrentUser);
  const ownerLeaving = currentMember?.role === "OWNER";

  return (
    <section className="mt-8 rounded-[2rem] border border-ink/10 bg-white/80 p-8 shadow-glow backdrop-blur">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-pitch-700">
            {labels.ownerTools}
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-ink">{labels.title}</h2>
        </div>
        <Users className="h-6 w-6 text-pitch-700" />
      </div>

      <p className="mt-4 text-sm leading-6 text-slate-600">
        {labels.ownerToolsCopy}
      </p>

      <div className="mt-6 divide-y divide-black/5 overflow-hidden rounded-3xl border border-black/5 bg-white">
        {members.map((member) => (
          <div
            className="flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
            key={member.id}
          >
            <div>
              <p className="font-semibold text-ink">{member.name}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {member.role === "OWNER" ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-pitch-50 px-3 py-1 text-xs font-semibold text-pitch-800">
                    <Crown className="h-3.5 w-3.5" />
                    {labels.ownerBadge}
                  </span>
                ) : null}
                {member.isCurrentUser ? (
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                    {labels.youBadge}
                  </span>
                ) : null}
              </div>
            </div>

            {isOwner && !member.isCurrentUser ? (
              <form
                action={removeGroupMember}
                onSubmit={(event) => {
                  if (!confirmWarning(labels.removeWarning)) {
                    event.preventDefault();
                  }
                }}
              >
                <input name="groupId" type="hidden" value={groupId} />
                <input name="targetUserId" type="hidden" value={member.userId} />
                <button
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100"
                  type="submit"
                >
                  <UserMinus className="h-4 w-4" />
                  {labels.removeMember}
                </button>
              </form>
            ) : null}
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <form
          action={leaveGroup}
          className="rounded-3xl border border-black/5 bg-slate-50 p-4"
          onSubmit={(event) => {
            if (!confirmWarning(labels.leaveWarning)) {
              event.preventDefault();
            }
          }}
        >
          <input name="groupId" type="hidden" value={groupId} />
          {ownerLeaving ? (
            <div className="mb-4">
              <label className="text-sm font-semibold text-slate-700" htmlFor="newOwnerUserId">
                {labels.transferOwner}
              </label>
              <select
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-pitch-500"
                disabled={otherMembers.length === 0}
                id="newOwnerUserId"
                name="newOwnerUserId"
                required
              >
                <option value="">{labels.transferOwnerPlaceholder}</option>
                {otherMembers.map((member) => (
                  <option key={member.id} value={member.userId}>
                    {member.name}
                  </option>
                ))}
              </select>
            </div>
          ) : null}
          <button
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-ink/10 bg-white px-5 py-3 text-sm font-semibold text-ink transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={ownerLeaving && otherMembers.length === 0}
            type="submit"
          >
            <LogOut className="h-4 w-4" />
            {labels.leaveGroup}
          </button>
        </form>

        {isOwner ? (
          <form
            action={deleteGroup}
            className="rounded-3xl border border-red-200 bg-red-50 p-4"
            onSubmit={(event) => {
              if (!confirmWarning(labels.deleteWarning)) {
                event.preventDefault();
              }
            }}
          >
            <input name="groupId" type="hidden" value={groupId} />
            <button
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-red-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-800"
              type="submit"
            >
              <Trash2 className="h-4 w-4" />
              {labels.deleteGroup}
            </button>
          </form>
        ) : null}
      </div>
    </section>
  );
}
