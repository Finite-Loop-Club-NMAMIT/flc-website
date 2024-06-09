"use client";
export type ButtonProps = {
  myfunc: () => void;
  data: string;
};

export function Button({ myfunc, data }: ButtonProps) {
  return (
    <div>
      <button
        type="submit"
        className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
        onClick={ myfunc}
      >
        {data}
      </button>
    </div>
  );
}
