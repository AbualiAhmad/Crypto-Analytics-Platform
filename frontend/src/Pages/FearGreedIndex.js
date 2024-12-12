import React from 'react'
import { LinearProgress, Container, Typography, makeStyles } from '@material-ui/core'
import { useEffect,useState } from 'react'
import axios from 'axios'
import FGIHistoricalData from '../components/FGIHistoricalData'
import GaugeChart from 'react-gauge-chart'

export const FearGreedIndex = () => {
    const useStyles = makeStyles((theme) => ({
      container: {
        display: "flex",
        [theme.breakpoints.down("md")]: {
          flexDirection: "column",
          alignItems: "center",
        },
      },
      sidebar: {
        width: "30%",
        [theme.breakpoints.down("md")]: {
          width: "100%",
        },
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: 25,
        borderRight: "2px solid grey",
      },
      heading: {
        fontWeight: "bold",
        marginBottom: 20,
        fontFamily: "Montserrat",
      },
      description: {
        width: "100%",
        fontFamily: "Montserrat",
        padding: 25,
        paddingBottom: 15,
        paddingTop: 0,
        textAlign: "justify",
      },
      marketData: {
        alignSelf: "start",
        padding: 25,
        paddingTop: 10,
        width: "100%",
        [theme.breakpoints.down("md")]: {
          display: "flex",
          justifyContent: "space-around",
        },
        [theme.breakpoints.down("sm")]: {
          flexDirection: "column",
          alignItems: "center",
        },
        [theme.breakpoints.down("xs")]: {
          alignItems: "start",
        },
      },
    }));
    const classes = useStyles();
    const [fgiValue, setFgiValue] = useState(.5);
    const [consensus, setConsensus] = useState("");

    const getColor = (x) =>{
        if (x<.33){
            return '#EA4228';
        }
        else if(x>=.33 && x<.66){
            return '#F5CD19';
        }else{
            return '#5BE12C';
        }
    }
    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await axios.get(`https://api.alternative.me/fng/?limit=2`);
            console.log(response)
            const value  = response.data.data[0].value/100
            const consensus =  response.data.data[0].value_classification;
            setConsensus(consensus)
            setFgiValue(value);
          } catch (error) {
            console.error(error);
          }
        };
      
        fetchData();
      }, []);

    
  return (
    <div className={classes.container}>
      <div className={classes.sidebar}>
      <Container>
        <GaugeChart id="gauge-chart5"
        nrOfLevels={420}
        arcsLength={[0.33, 0.33, 0.33]}
        colors={[ '#EA4228','#F5CD19','#5BE12C']}
        percent={fgiValue}
        arcPadding={0.02}
        textColor= "transparent"

        /> 
        </Container>
        <Typography variant="h4" className={classes.heading}>
          Fear and Greed Index
        </Typography>
        <Typography variant="subtitle1" className={classes.description}>
The Fear and Greed Index measures the emotional state of the crypto market. It helps identify opportunities and potential corrections. The index analyzes factors like volatility, market momentum, social media activity, surveys, dominance, and search trends to create a meter ranging from 0 (Extreme Fear) to 100 (Extreme Greed). By monitoring these indicators, it aims to prevent emotional overreactions and provide valuable insights to investors.
        </Typography>
        <div className={classes.marketData}>
          <span style={{ display: "flex" }}>
            <Typography variant="h5" className={classes.heading}>
              Market Sentiment:
            </Typography>
            &nbsp; &nbsp;
            <Typography
              variant="h5"
              style={{
          fontFamily: "Montserrat",
          color: getColor(fgiValue)
        }}>
              {consensus}
            </Typography>
                      </span>

          <span style={{ display: "flex" }}>
            <Typography variant="h5" className={classes.heading}>
              Current FGI Score:
            </Typography>
            &nbsp; &nbsp;
            <Typography
              variant="h5"
              style={{
                fontFamily: "Montserrat",
                color: getColor(fgiValue)
              }}
            >
            {fgiValue*100}%
            </Typography>
          </span>
        </div>
      </div>
      <FGIHistoricalData/>
    </div>
 )
}