
import dynamic from 'next/dynamic'


const TextEditor = dynamic(() => import('./subEditor'), {
  ssr: false
})



export default function Editor(props) {

  

  function onChange(newValue) {
    props.setCode(newValue)
  }

  return (
    <div className="w-full h-full z-10 pt-2 flex-1">
      <TextEditor onChange={onChange} text={props.code} />
    </div>
  )
}