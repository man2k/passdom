import { FC } from "react";
interface prop {
  placeholder: string;
}

const TextBox: FC<prop> = (prop: prop) => {
  return (
    <div>
      <input
        className="input input-bordered textarea-warning w-full max-w-xs bg-slate-500 rounded-lg font-mono text-black h-10"
        placeholder={prop.placeholder}
        type="text"
      />
    </div>
  );
};

export default TextBox;
