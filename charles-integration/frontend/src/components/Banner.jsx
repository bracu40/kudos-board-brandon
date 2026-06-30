function Banner() {
  return (
    <div
      className="relative overflow-hidden"
      style={{
        background:
          'linear-gradient(135deg, #7c3aed 0%, #c026d3 45%, #f59e0b 100%)',
      }}
    >
      <div className="absolute inset-0 bg-black/20" />
      <div className="relative mx-auto max-w-[1126px] px-6 py-16 text-center">
        <h1 className="mb-4 text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl">
          Kudos Board
        </h1>
        <p className="mx-auto max-w-md text-lg leading-relaxed text-white/80">
          Create a board, post a card, and recognize your teammates.
        </p>
      </div>
    </div>
  )
}

export default Banner
