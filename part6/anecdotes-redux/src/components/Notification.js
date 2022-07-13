import { connect } from 'react-redux'

const Notification = ({ notification }) => {

  const style = notification
    ? { border: 'solid', padding: 10, borderWidth: 1 }
    : { display: 'none' }

  return (
    <div style={style}>
      {notification}
    </div>
  )
}

const mapStateToProps = ({ notification }) => {
  return {notification: notification.text }
}

const ConnectedNotification = connect(mapStateToProps)(Notification)

export default ConnectedNotification