import type { Group } from "@/features/groups/groups.types"

type Props = {
  group: Group
  onClose: () => void
}

export default function GroupInfoPanel({ group, onClose }: Props) {
  return (
    <div className="w-80 bg-slate-900 border-l border-slate-700 flex flex-col">
      <div className="h-14 px-4 flex items-center justify-between border-b border-slate-700">
        <h3 className="text-white font-semibold">
          Group Info
        </h3>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white"
        >
          ✕
        </button>
      </div>
      <div className="p-4 space-y-4 text-sm text-slate-300">
        <div>
          <p className="text-xs text-slate-400">Name</p>
          <p className="text-white">{group.name}</p>
        </div>

        <div>
          <p className="text-xs text-slate-400">Description</p>
          <p>{group.description || "No description"}</p>
        </div>

        <div>
          <p className="text-xs text-slate-400 mb-2">
            Members ({group.members.length})
          </p>

          <div className="space-y-2">
            {group.members.map((member) => (
              <div
                key={member._id}
                className="flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs">
                  {(member.name || member.email)[0]}
                </div>

                <div>
                  <p className="text-white text-sm">
                    {member.name || member.email}
                  </p>
                  <p className="text-xs text-slate-400">
                    {member.email}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
