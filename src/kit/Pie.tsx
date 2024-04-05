const Pie = ({ }: { }) => (
  <>
    <div
      className="Pie mx-auto w-[200px] h-[200px] rounded-full bg-[#8881]"
      // style={{ width: size, height: size }}
    >
      <div className="w-[200px] h-[200px]" style={{
        borderRadius: '50%',
        background: 'radial-gradient(closest-side, white 85%, transparent 86% 100%), conic-gradient(#82C4B8 0%, #82C4B8 66%, #B89AE4 66%, #B89AE4 88%, #FFBE7C 88%, #FFBE7C 100%)'
      }}>
      </div>
    </div>
  </>
)

export default Pie
