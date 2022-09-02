const Notification = ({ message, successful }) => {
  if (message === null) {
    return null
  }
  return (
    <div className={successful ? 'successful' : 'unsuccessful'}>{message}</div>
  )
}
  
export default Notification;
