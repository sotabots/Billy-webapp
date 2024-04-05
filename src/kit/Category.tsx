const Category = ({ color }: { color: string }) => {
  const borderColor = color + '44'
  return (
    <div
      className="flex gap-2 px-2 border rounded-[6px] text-[14px] leading-[24px] tracking-[-0.084em]"
      style={{ borderColor, color }}
    >
      <span className="flex items-center justify-center">🛒</span>
      <span className="">Some category</span>
      <span className="font-semibold">$3,387.43</span>
    </div>
)}

export default Category
