
import dynamic from 'next/dynamic'


const TextEditor = dynamic(() => import('./subEditor'), {
  ssr: false
})



export default function Editor(props) {

  

  function onChange(newValue) {
    props.setCode(newValue)
  }

  return (
    <div className="flex-1 w-full h-full z-10 pt-2">
      <TextEditor theme='xcode' onChange={onChange} text={props.code} />
    </div>
  )
}