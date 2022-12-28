interface InputData {
    onChange?: any;
    value?: any;
    type?: string;
    placeholder?: string;
    required?: boolean;
    label?: string
}

const Input = ({onChange, label, value, type, placeholder, required}:InputData) => {
return (<>
    {label&&<label className="block mb-2 text-sm font-medium text-gray-900 text-white">{label}</label>}
    <input onChange={onChange} value={value} type={type} id="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 text-black focus:border-blue-500 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" placeholder={placeholder} required={required}/>
    </>
)}

export default Input