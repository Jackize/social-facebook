import { DataSaverOn, DataSaverOnOutlined, ExpandLess, ExpandMore } from '@mui/icons-material'
import { Box, Button, Collapse, Divider, List, ListItem, ListItemButton, ListItemText, ListSubheader, Paper, Stack, TextField } from '@mui/material'
import React, { useState } from 'react'

const Saving = () => {
    const [Open, setOpen] = useState({
        2023: {
            months: {
                1: { open: true, days: [1, 2, 3, 4] },
                2: { open: true, days: [1, 2, 3, 4] },
                3: { open: true, days: [1, 2, 3, 4] },
                4: { open: false, days: [1, 2, 3, 4] },
                5: { open: false, days: [1, 2, 3, 4] },
                6: { open: false, days: [1, 2, 3, 4] },
                7: { open: false, days: [1, 2, 3, 4] },
            },
            open: true
        },
        2024: {
            months: {
                1: { open: true, days: [1, 2, 3, 4] },
                2: { open: true, days: [1, 2, 3, 4] },
                3: { open: true, days: [1, 2, 3, 4] },
                4: { open: false, days: [1, 2, 3, 4] },
                5: { open: false, days: [1, 2, 3, 4] },
                6: { open: false, days: [1, 2, 3, 4] },
                7: { open: false, days: [1, 2, 3, 4] },
            },
            open: false
        },
    })

    const handleCollapseYear = (year) => {
        setOpen(prevOpen => {
            const newOpen = { ...prevOpen }

            newOpen[year] = { ...newOpen[year], open: !newOpen[year].open }
            return newOpen
        })
    }

    const handleCollapseMonth = (year, month) => {
        setOpen(prevOpen => {
            const newOpen = { ...prevOpen }

            newOpen[year].months[month] = { ...newOpen[year].months[month], open: !newOpen[year].months[month].open }
            return newOpen
        })
    }

    const handleFilter = (e) => {
        console.log(e.target.value);
    }

    const handleCollapseAll = () => {
        setOpen((prevOpen) => {
            const newOpen = {};

            // Iterate through the keys and set open to false for each item
            Object.keys(prevOpen).forEach((id) => {
                newOpen[id] = { ...prevOpen[id], open: false };
            });

            return newOpen;
        })
    }
    return (
        <Stack direction={'row'} sx={{ flex: 5, p: 5 }}>
            <Paper variant="elevation" elevation={24} sx={{ display: "flex", flex: "3", height: "700px" }}>
                <Box flex={1} p={1} sx={{ overflow: "auto" }}>
                    <TextField
                        id="filter"
                        label="Filter"
                        placeholder="YYYY-MM-DD"
                        sx={{ marginBottom: 3 }}
                        onChange={(e) => handleFilter(e)}
                        fullWidth
                    />
                    <Button variant='contained' endIcon={<DataSaverOnOutlined />} fullWidth sx={{ marginBottom: 3 }}>
                        Add New
                    </Button>

                    <Button variant='contained' fullWidth sx={{ marginBottom: 3 }} onClick={() => handleCollapseAll()}>
                        Collapse
                    </Button>

                    <Divider orientation="horizontal" flexItem />

                    <List
                        sx={{
                            width: '100%',
                            bgcolor: 'background.paper',
                            position: 'relative',
                            marginTop: 2,
                            overflow: 'auto',
                            '& ul': { padding: 0 },
                        }}
                    >
                        {
                            // Show List year
                            Object.keys(Open).length > 0 && Object.keys(Open).map(year => (
                                <li key={`section-${year}`}>
                                    <ul>
                                        <ListItemButton id={`section-${year}`} onClick={() => handleCollapseYear(year)}>
                                            <ListItemText color='primary' primary={`Year ${year}`} />
                                            {Open[year].open ? <ExpandLess /> : <ExpandMore />}
                                        </ListItemButton>

                                        <Collapse in={Open[year].open} timeout="auto" unmountOnExit>
                                            {
                                                Object.keys(Open[year].months).length > 0 && Object.keys(Open[year].months).map(month => {

                                                    return (
                                                        // Show List months
                                                        <List key={`${year}-${month}`}>
                                                            <ListItem>
                                                                <ListItemButton id={`section-${month}`} onClick={() => handleCollapseMonth(year, month)}>
                                                                    <ListItemText color='primary' primary={`month ${month}`} />
                                                                    {Open[year].months[month].open ? <ExpandLess /> : <ExpandMore />}
                                                                </ListItemButton>
                                                            </ListItem>
                                                            <Collapse in={Open[year].months[month].open} timeout="auto">
                                                                {Open[year].months[month].days.map(day => {
                                                                    // Show List days
                                                                    return (
                                                                        <List key={`${year}-${month}-${day}`} component="div" disablePadding>
                                                                            <ListItemButton key={`${year}-${month}-${day}`}>
                                                                                <ListItem >
                                                                                    <ListItemText primary={`Day ${day}`} />
                                                                                </ListItem>
                                                                            </ListItemButton>
                                                                        </List>
                                                                    )
                                                                })}
                                                            </Collapse>
                                                        </List>
                                                    )
                                                })
                                            }
                                        </Collapse>
                                    </ul>
                                </li>
                            ))}
                    </List>
                </Box>

                <Divider orientation="vertical" flexItem />

                <Box flex={3}>
                    df2
                </Box>

            </Paper>
        </Stack>
    )
}

export default Saving