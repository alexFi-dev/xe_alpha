import { Box, Container, Grid, Typography, Button } from '@mui/material'
import axios from 'axios'
import { useTelegram } from './hooks/useTelegram'
import { useContext, useEffect, useState } from 'react'
import InputAmount from './components/InputAmount'
import SelectCountry from './components/SelectCountry'
import SwitchCurrency from './components/SwitchCurrency'
import { CurrencyContext } from './context/CurrencyContext'

function App(props) {

  const {tg, onToggleButton} = useTelegram();

  useEffect( () => {
    tg.ready()
  }, [])
  
  const {
    fromCurrency,
    setFromCurrency,
    toCurrency,
    setToCurrency,
    firstAmount,
    setFirstAmount
  } = useContext(CurrencyContext)
  const [resultCurrency, setResultCurrency] = useState(0);
  const codeFromCurrency = fromCurrency.split(" ")[1];
  const codeToCurrency = toCurrency.split(" ")[1];

  useEffect(() => {
    if(firstAmount) {
      axios("https://api.freecurrencyapi.com/v1/latest", {
        params: {
          apikey: "fca_live_R959j1sRGJNIQMCTgK6znRLVtHBHBFt1pxU16V0z",
          base_currency: codeFromCurrency,
          currencies: codeToCurrency
        }
      })
        .then(response => setResultCurrency(response.data.data[codeToCurrency]))
        .catch(error => console.log(error))
    }
  }, [firstAmount, fromCurrency, toCurrency])

  const boxStyles = {
    background: "#fdfdfd",
    margin: "2rem 0",
    textAlign: "center",
    color: "#222",
    padding: "2rem",
    borderRadius: 2,
    boxShadow: "0px 10px 15px -3px rgba(0,0,0,0.1)",
    position: "relative"
  }

  return (
    <Container maxWidth="md" sx={boxStyles}>
      <Typography variant='h6' sx={{margin: "20px 0"}}>Exchange bot. Alpha v.0.1</Typography>
      <span className={'username'}>
          {tg.user?.username}
      </span>
      <Grid container spacing={2}>
        <InputAmount />
        <SelectCountry value={fromCurrency} setValue={setFromCurrency} label="From" />
        <SwitchCurrency />
        <SelectCountry value={toCurrency} setValue={setToCurrency} label="To" />
      </Grid>
      {firstAmount ? (
        <Box sx={{ textAlign: "left", marginTop: "2rem"}}>
          <Typography>{firstAmount} {fromCurrency} =</Typography>
          <Typography variant='h5' sx={{ marginTop: "5px", fontWeight: "bold"}}> {Math.round(resultCurrency*firstAmount * 100) / 100} {toCurrency} </Typography>
        </Box>
      ) : ""}
      <Button sx={{ marginTop: "30px"}} onClick={onToggleButton}>go-go TG!</Button>
    </Container>
  )
}

export default App
