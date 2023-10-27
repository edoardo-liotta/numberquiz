import {AppBar, Box, IconButton, Toolbar} from '@mui/material';
import {Leaderboard, PlayCircle} from '@mui/icons-material';

interface HostActionsProps {
    onShowLeaderboard: () => void;
    onShowRound: () => void;
}

const HostActions: React.FC<HostActionsProps> = (props) => {

    return <div className={"HostActions"}>
        <AppBar position="fixed" color="primary" sx={{top: 'auto', bottom: 0}}>
            <Toolbar>
                <IconButton color="inherit" onClick={props.onShowLeaderboard}>
                    <Leaderboard />
                </IconButton>
                <Box sx={{flexGrow: 1}} />
                <IconButton color="inherit" onClick={props.onShowRound}>
                    <PlayCircle />
                </IconButton>
            </Toolbar>
        </AppBar>
    </div>
}

export default HostActions