import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import {
  getClientUrl,
  getConfiguration,
  getDeviceId,
  getPlayerId,
  getServiceUrl,
  resetConfiguration,
  setConfiguration
} from '../../api/config-api';


const Configuration = (props) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const triggerEditDialogOpen = () => setEditDialogOpen(true)
  const triggerEditDialogClose = () => setEditDialogOpen(false)
  const updateConfig = () => {
    const defaultConfig = getConfiguration()
    const newConfig = { ...defaultConfig }
    const playerIdField = document.getElementById("config-playerId")
    if (playerIdField) {
      newConfig.playerId = playerIdField.value
    }
    const deviceIdField = document.getElementById("config-deviceId")
    if (deviceIdField) {
      newConfig.deviceId = deviceIdField.value
    }
    const serviceUrlField = document.getElementById("config-serviceUrl")
    if (serviceUrlField) {
      newConfig.serviceUrl = serviceUrlField.value
    }
    const clientUrlField = document.getElementById("config-clientUrl")
    if (clientUrlField) {
      newConfig.clientUrl = clientUrlField.value
    }
    setConfiguration(newConfig)
    if (props.onSave) {
      props.onSave(newConfig)
    }
    triggerEditDialogClose()
  }

  const resetConfig = () => {
    resetConfiguration()
  }

  useEffect(() => {
    if (props.autoOpen === true) {
      triggerEditDialogOpen()
    }
  }, [props.autoOpen]);

  return <>
    <Button onClick={triggerEditDialogOpen} variant="outlined">Configure</Button>
    <Button onClick={resetConfig} variant="outlined">Reset configuration</Button>
    <Dialog open={editDialogOpen} onClose={triggerEditDialogClose}>
      <DialogTitle>Configurazione</DialogTitle>
      <DialogContent>
        <TextField
            autoFocus
            id="config-playerId"
            label="Il tuo nome"
            type="text"
            fullWidth
            variant="standard"
            defaultValue={getPlayerId()}
        />
        <TextField
            id="config-deviceId"
            label="ID del dispositivo"
            type="text"
            fullWidth
            variant="standard"
            defaultValue={getDeviceId()}
        />
        <TextField
            id="config-serviceUrl"
            label="Service URL"
            type="url"
            fullWidth
            variant="standard"
            defaultValue={props.serviceUrl || getServiceUrl()}
        />
        <TextField
            id="config-clientUrl"
            label="Client URL"
            type="url"
            fullWidth
            variant="standard"
            defaultValue={props.clientUrl || getClientUrl()}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={triggerEditDialogClose}>Annulla</Button>
        <Button onClick={updateConfig}>Conferma</Button>
      </DialogActions>
    </Dialog>
  </>
}

export default Configuration