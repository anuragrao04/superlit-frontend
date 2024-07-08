export default function CodeBlock({ code, className }: { code: string, className: string }) {
  return (
    <div className={"rounded-sm bg-gray-800 text-white p-2 m-2 w-full h-full overflow-x-scroll" + className} >
      <pre>
        <code>
          {code}
        </code>
      </pre>
    </div>
  )
}
