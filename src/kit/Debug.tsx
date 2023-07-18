import Panel from './Panel'

function Debug() {
  return (
    <Panel className="mt-10 text-[12px]">
      <h2>Debug</h2>
      {location.href}
    </Panel>
  )
}

export default Debug
