type Props = {
  name: string
  onInfoClick: () => void
}

export default function GroupHeader({ name, onInfoClick }: Props) {
  return (
    <div
      className="h-14 px-4 flex items-center gap-3 border-b border-slate-700 bg-slate-800 cursor-pointer"
      onClick={onInfoClick}
    >
      <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold">
        {name[0]}
      </div>

      <h2 className="text-sm font-semibold text-white">
        {name}
      </h2>
    </div>
  )
}
