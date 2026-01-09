type Props = {
  name: string
}

export default function GroupHeader({ name }: Props) {
  return (
    <div className="h-14 px-4 flex items-center gap-3 border-b border-slate-700 bg-slate-800">
      <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center">
        {name[0]}
      </div>

      <h2 className="text-base font-semibold text-white">
        {name}
      </h2>
    </div>
  )
}
