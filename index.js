import 'dotenv/config';
import express from 'express'
import { getSalary } from './utils/salary.js'

const app = express()

app.get('/getSalaryData', async (req, res) => {
  try {
    const salary = await getSalary()
    if (salary) {
      res.status(200).json(salary).end()
    } else {
      res.status(503).json({error: "Price sources failed to respond"})
    }
  } catch (e) {
    console.error(e)
    res.status(503).json({error: "There was an error, try again"})
  }
})

app.listen(3000, () => {
  console.log('App listening on port 3000.')
})