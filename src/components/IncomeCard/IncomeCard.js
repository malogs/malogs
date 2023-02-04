import Card from '../Card';
import styles from './styles.module.css';

function IncomeCard({name, value}) {
  return (
    <div className={styles.incomecard}>
      <Card><span>{name}</span><span>{value}Rwf</span></Card>
    </div> 
  )
}

export default IncomeCard