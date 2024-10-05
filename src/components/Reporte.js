import React, { useEffect, useState } from "react";
import {
  Button,
  FormControl,
  MenuItem,
  Grid,
  Box,
  TextField,
  Checkbox,
  ListItemText,
  ListItemSecondaryAction,
} from "@mui/material";
import moment from "moment";
import axios from "axios";
import "./styles.css";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const Reporte = () => {
  const [fechaInicio, setFechaInicio] = useState(moment(new Date()).format('YYYY-MM-DD'));
  const [currentDate, setCurrentDate] = useState(moment(new Date()).format('YYYY-MM-DD'));
  const [fechaFin, setFechaFin] = useState(moment(new Date()).format('YYYY-MM-DD'));
  const [selectedOptions, setSelectedOptions] = React.useState([]);
  const [tickets, setTickets] = React.useState([]);

  useEffect(() => {
    setCurrentDate(moment(new Date()).format('YYYY-MM-DD'));
    getsTickets();
  }, []);

  const getsTickets = async () => {
    const tiposTickets = await axios.get(
      `http://localhost:9000/api/empresa-x-reportes/tipos-tickets?`,
      {
        responseType: "json",
      }
    );

    setTickets(tiposTickets.data);
  };

  const handleChangeFechaInicioData = async (event) => {
    if (event.target.value) {
      
      setFechaInicio(event.target.value);
  
      console.log(event.target.value); 
    }
  };

  const handleChangeFechaFinData = async (event) => {
    if (event.target.value) {
      
      setFechaFin(event.target.value);
  
      console.log(event.target.value); 
    }
  };

  const handleChangeTipo = (event) => {
    setSelectedOptions(event.target.value);
  };

  const handleChangeTipoCheckbox = async (event) => {
    const value = event.target.value;

    setSelectedOptions((prevSelectedOptions) => {
      if (prevSelectedOptions.includes(value)) {
        console.log(prevSelectedOptions);
        return prevSelectedOptions.filter((options) => options !== value);
      } else {
        return [...prevSelectedOptions, value];
      }
    });
  };

  const handleDescargar = async () => {
    if (!fechaInicio || !fechaFin || !selectedOptions) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    try {
    const urls = `http://localhost:9000/api/empresa-x-reportes/obtener-reporte-tickets?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`;

    const response = await axios.post(urls, 
      selectedOptions,
      {responseType: "json"}
    );

      console.log(response);
      const reporte = response.data;
      let Heading = [
        ['Celular usuario', 'Número de Emp.Usuario', 'Nombre usuario','Número de Emp.Técnico' , 
         'Sucursal', 'Nombre abreviado', 'Nombre del Técnico', 'Email del Técnico','Tipo de ticket' ,'Fecha de atención' , 'Puntuación de atención' ]
        ];

        let ddI = (fechaInicio.slice(8, 10)).toString();
        let mmI = (fechaInicio.slice(5, 7)).toString();
        const yyyyI = (fechaInicio.slice(0, 4)).toString();
        const dateInicial = `${ddI}-${mmI}-${yyyyI}`;

        let ddE = (fechaInicio.slice(8, 10)).toString();
        let mmE = (fechaInicio.slice(5, 7)).toString();
        const yyyyE = (fechaInicio.slice(0, 4)).toString();
        const dateEnd = `${ddE}-${mmE}-${yyyyE}`;

        const worksheet = XLSX.utils.json_to_sheet(reporte);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.sheet_add_aoa(worksheet, Heading);
        XLSX.utils.sheet_add_json(workbook, reporte, { origin: 'A2', skipHeader: true });
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Hoja1');

        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { 
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
        });

        saveAs(blob, `Reporte de tipos de tickets de Empresa X ${dateInicial} a ${dateEnd}.xlsx`);
    } catch (error) {
      console.error("Error al descargar el reporte:", error);
      alert(
        "Hubo un error al generar el reporte. Por favor, intenta de nuevo."
      );
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Grid container spacing={3} alignItems="center">
        {/* DatePicker para Fecha Inicio */}
        <Grid item xs={12} sm={4}>
          <TextField
              style={{ width: '100%' }}
              variant="outlined"
              type="date"
              name="fechaInicio"
              label="Fecha Inicio"
              id="fechaInicio"
              onChange={handleChangeFechaInicioData}
              value={fechaInicio}
              //inputFormat="dd-MM-yyyy"
              shrink={true}
              inputPropsExtras={{ max: currentDate }}
            />
        </Grid>

        {/* DatePicker para Fecha Fin */}
        <Grid item xs={12} sm={4}>
        <TextField
              style={{ width: '100%' }}
              variant="outlined"
              type="date"
              name="fechaFin"
              label="Fecha Fin"
              id="fechaFin"
              onChange={handleChangeFechaFinData}
              value={fechaFin}
              //inputFormat="dd-MM-yyyy"
              shrink={true}
              inputPropsExtras={{ max: currentDate }}
            />
        </Grid> 
        
        {/* Select para opciones */}
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <TextField
              select
              variant="outlined"
              label="Tickets"
              value={selectedOptions}
              onChange={handleChangeTipo}
              InputLabelProps={{
                shrink: true,
                style: { color: "#1976d2" },
                focused: "css-label-focused",
              }}
              InputProps={{
                classes: {
                  root: "filtro-tipo-ticket",
                  notchedOutline: "css-input-focused",
                  focused: "css-input-focused",
                },
              }}
              SelectProps={{
                multiple: true,
                renderValue: (selected) => selected.join(", "),
              }}
            >
              {tickets.map((options) => (
                <MenuItem
                  className="custom-menu-item"
                  key={options.nombreTicket}
                  value={options.nombreTicket}
                >
                  <ListItemText
                    primary={options.nombreTicket}
                    className="list-item-label"
                  />
                  <ListItemSecondaryAction>
                    <Checkbox
                      checked={selectedOptions.includes(options.nombreTicket)}
                      className="color-checkbox"
                      value={options.nombreTicket}
                      key={options.nombreTicket}
                      onChange={handleChangeTipoCheckbox}
                    />
                  </ListItemSecondaryAction>
                </MenuItem>
              ))}
            </TextField>
          </FormControl>
        </Grid>

        {/* Botón Descargar */}
        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={handleDescargar}>
            Descargar
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Reporte;
