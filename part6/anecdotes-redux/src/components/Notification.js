import { useSelector } from 'react-redux'

const Notification = () => {

  const text = useSelector(state => state.notification)

  const style = text
    ? { border: 'solid', padding: 10, borderWidth: 1 }
    : { display: 'none' }

  return (
    <div style={style}>
      {text}
    </div>
  )
}

export default Notification