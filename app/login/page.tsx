import { login, signup } from './actions'
import styles from './login.module.css'

export default function LoginPage() {
  return (
    <div className={styles.login_page}>
      <h2>ログイン</h2>
    <form className={styles.form}>
      <div className={styles.form_container}>
        <label className={styles.form_label} htmlFor="email">Email:</label>
        <input className={styles.form_input} id="email" name="email" type="email" required />
      </div>
      <div className={styles.form_container}>
        <label className={styles.form_label} htmlFor="password">Password:</label>
        <input className={styles.form_input} id="password" name="password" type="password" required />
      </div>  
      <button className={styles.form_btn} formAction={login}>Log in</button>
      <button className={styles.form_btn} formAction={signup}>Sign up</button>
    </form>
    </div>
  )
}