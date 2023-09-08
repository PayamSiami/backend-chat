import app from './app'

// env variables
const PORT = process.env.PORT || 8000

app.listen(PORT, () => {
  console.log(`server is listinig at port ${PORT}`)
})
