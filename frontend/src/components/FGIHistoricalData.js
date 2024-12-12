import React from 'react'
import axios from "axios";
import { useEffect, useState } from "react";
import { HistoricalChart } from "../config/api";
import { Line } from "react-chartjs-2";
import {
  CircularProgress,
  createTheme,
  makeStyles,
  ThemeProvider,
} from "@material-ui/core";
import SelectButton from "./SelectButton";
import { chartDays } from "../config/data";
import { CryptoState } from "../CryptoContext";
import 'chart.js/auto'

const FGIHistoricalData = () => {
    const [historicData, setHistoricData] = useState();

      const [days, setDays] = useState(30);
      const [flag,setflag] = useState(false);
    
      const useStyles = makeStyles((theme) => ({
        container: {
          width: "75%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          marginTop: 25,
          padding: 40,
          [theme.breakpoints.down("md")]: {
            width: "100%",
            marginTop: 0,
            padding: 20,
            paddingTop: 0,
          },
        },
      }));
    
      const classes = useStyles();
    
      const fetchHistoricData = async () => {
        const {data} = await axios.get(`https://api.alternative.me/fng/?limit=365&date_format=us`);
        setHistoricData(data.data.reverse())
        console.log(data.data)    
        setflag(true);
      };
    
      useEffect(() => {
        fetchHistoricData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [days]);
    
      const darkTheme = createTheme({
        palette: {
          primary: {
            main: "#fff",
          },
          type: "dark",
        },
      });
    
      return (
        <ThemeProvider theme={darkTheme}>
          <div className={classes.container}>
            {!historicData | flag===false ? (
              <CircularProgress
                style={{ color: "gold" }}
                size={250}
                thickness={1}
              />
            ) : (
              <>
                <Line
                  data={{
                    labels: historicData.slice(365-days).map((day) => {
                      let date = new Date(day.timestamp);
                      let time =
                        date.getHours() > 12
                          ? `${date.getHours() - 12}:${date.getMinutes()} PM`
                          : `${date.getHours()}:${date.getMinutes()} AM`;
                      return date.toLocaleDateString();
                    }),
    
                    datasets: [
                      {
                        data: historicData.slice(365-days).map((res) => res.value),
                        label: `Fear And Greed Index ( Past ${days} Days )`,
                        borderColor: "#366bff",
                      },
                    ],
                  }}
                  options={{
                    elements: {
                      point: {
                        radius: 1,
                      },
                    },
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    marginTop: 20,
                    justifyContent: "space-around",
                    width: "100%",
                  }}
                >
                  {chartDays.slice(1).map((day) => (
                    

                <SelectButton
                      key={day.time}
                      onClick={() => {setDays(day.value);
                        setflag(false);
                      }}
                      selected={day.value === days}
                    >
                      {day.label}
                    </SelectButton>
                     
                  ))}
                </div>
              </>
            )}
          </div>
        </ThemeProvider>
      );
    };

export default FGIHistoricalData;