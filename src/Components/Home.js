import React, { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom';
import { Navigate } from 'react-router';
import Navv from './Navv';
import img1 from "./1.PNG";
import img2 from "./2.PNG";
import img3 from "./3.PNG";
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Card, CardGroup ,Row,Col} from 'react-bootstrap';
import {Grid,Box, TextField,Button, Typography } from '@mui/material';
const URL = "http://localhost:3001/calci"
const regForName = RegExp(/^[a-zA-Z]/);
export const Home = () => {
    const Item = styled(Paper)(({ theme }) => ({
        ...theme.typography.body2,
        padding: theme.spacing(1),
        color: theme.palette.text.secondary,
    }));
    const budgetRef = useRef(0)
    const TitleRef = useRef('')
    const AmountRef = useRef(0)
    const [data, setData] = useState({});
    const [userdata, setuserdata] = useState([]);
    const [index, setindex] = useState(0);
    const [budgetdisplay, setbudgetdisplay] = useState(0)
    const [expensesdisplay, setexpensesdisplay] = useState(0)
    const [balance, setbalance] = useState(0)
    const [toggleBtn, settoggleBtn] = useState(true)
    const add = () => {
        const user = JSON.parse(localStorage.getItem('mycart'))
        const bud = parseFloat(budgetRef.current.value);
        if (bud > 0) {
            user.totalbudget = parseFloat(user.totalbudget + bud)
            user.balance = user.balance + bud
            localStorage.setItem('mycart', JSON.stringify(user))
            budgetRef.current.value = ""
        }
        else {
            alert("Budget Should be more than Zero")
        }
        refresh()
    }
    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
          backgroundColor: theme.palette.common.black,
          color: theme.palette.common.white,
        },
        [`&.${tableCellClasses.body}`]: {
          fontSize: 14,
        },
      }));
      const StyledTableRow = styled(TableRow)(({ theme }) => ({
        '&:nth-of-type(odd)': {
          backgroundColor: theme.palette.action.hover,
        },
        // hide last border
        '&:last-child td, &:last-child th': {
          border: 0,
        },
      }));
    const AddExpense = () => {
        const user = JSON.parse(localStorage.getItem('mycart'))
        const usertitle = TitleRef.current.value
        const useramount = parseFloat(AmountRef.current.value)
        if (usertitle != null && regForName.test(usertitle)) {
            const saving = expensesdisplay + useramount
            console.log(expensesdisplay,saving,useramount,user.balance,budgetdisplay)
            if (useramount > 0) {
                if (saving <= budgetdisplay) {
                    const expense = { title: usertitle, amount: useramount }
                    user.budget = [...user.budget, expense]
                    localStorage.setItem('mycart', JSON.stringify(user))
                    TitleRef.current.value = ""
                    AmountRef.current.value = ""
                }
                else {
                    alert('balance is 0')
                }
            }
            else {
                alert("Budget Should be more than Zero")
            }
        }
        else {
            alert("Please enter correct title")
        }
        refresh()
    }
    const deletes = (index) => {
        const user = JSON.parse(localStorage.getItem('mycart'))
        const bool = window.confirm("Do You really want to delele this?")
        if (bool === true) {
            user.budget.splice(index, 1)
            setData({ ...user });
            localStorage.setItem('mycart', JSON.stringify(user));
        }
        const user1 = JSON.parse(localStorage.getItem('mycart'))
        const userd = user1.budget
        setuserdata([...userd])
        refresh()
    }
    useEffect(() => {
        if (localStorage.getItem('mycart') !== undefined) {
            console.log('samiksha')
            refresh()
        }
    }, [])
    const refresh = () => {
        const user1 = JSON.parse(localStorage.getItem('mycart'))
        const userd = user1.budget
        setuserdata([...userd])
        setbudgetdisplay(user1.totalbudget)
        let exp = 0
        user1.budget.map(ele =>
            exp = ele.amount + parseFloat(exp)
        )
        user1.balance = user1.totalbudget - exp
        setexpensesdisplay(exp)
        setbalance(user1.totalbudget - exp)
        localStorage.setItem('mycart', JSON.stringify(user1))
    }
    const update = (index, ele) => {
        console.log(ele)
        TitleRef.current.value = ele.title
        AmountRef.current.value = ele.amount
        settoggleBtn(false)
        setindex(index)
    }
    const updatedata = () => {
        let user = JSON.parse(localStorage.getItem('mycart'));
        let temp = user.budget
        console.log(temp)
        temp[index].title = TitleRef.current.value
        temp[index].amount = parseInt(AmountRef.current.value)
        console.log(temp)
        user.budget = temp
        settoggleBtn(true)
        localStorage.setItem('mycart', JSON.stringify(user))
        setuserdata([...user.budget])
        TitleRef.current.value = null
        AmountRef.current.value = null
        refresh()
    }
    const logout = () => {
        let data = JSON.parse(localStorage.getItem('mycart'))
        axios.put(`http://localhost:3001/calci/${data.id}`, data)
        localStorage.removeItem('mycart');
    }
    return (
    <>
    {localStorage.getItem('mycart') == undefined &&
        <Navigate to="/"></Navigate>}
        <Navv />
        <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
        <Grid item xs={3} sx={{
            display: 'flex',
            flexWrap: 'wrap',
            '& > :not(style)': {
            height: 600,
            borderRadius: '10px',
            },
        }}>
        <Item>
        <Grid container spacing={2}>
        <Grid item xs={12} sm={12} style={{ marginTop: '50px' }}>
        <Grid>
        <h1>Budget App</h1>
        <h3>Enter Budget</h3>
            <TextField type="number" inputRef={budgetRef} label="Enter Budget"></TextField>
                <br/><br/>
            <Button variant="contained" type="submit" value="Add" fullWidth  className="success" onClick={add}  sx={{
                color:'primary',
                borderRadius:'20px'}}>
            <Typography variant="h6" component="div" >
            Add
            </Typography>
            </Button>
        </Grid>
            <h3>Enter Expense</h3>
            <TextField autoComplete="given-name" required type="text" fullWidth inputRef={TitleRef} label="Enter your Expense Title "></TextField>
        </Grid>
        <Grid item xs={12} sm={12}>
            <TextField className="head" type="text" fullWidth inputRef={AmountRef} label="Enter your Expense Amount "></TextField>
        </Grid>
        </Grid>
        <br/>
        {toggleBtn ? <Button variant="contained" type="submit" value="Add" fullWidth  className="success" onClick={AddExpense}  sx={{
            color:'primary',
            borderRadius:'20px'
            }} >
            <Typography variant="h6" component="div" >
            Add Expense
            </Typography>
            </Button>: 
            <Button variant="contained" type="submit" value="Add" fullWidth  className="success" onClick={updatedata}  sx={{
                color:'primary',
                borderRadius:'20px'
                }} >
            <Typography variant="h6" component="div" >
            Edit Expense
            </Typography>
            </Button>}
        </Item>
        </Grid>
        <Grid item xs={9}>
        <Item>
        <h1>Welcome </h1>
        <Box
            sx={{
            display: 'flex',
            flexWrap: 'wrap',
            '& > :not(style)': {
            m: 1,
            width: 1000,
            borderRadius: '10px',
            },
        }}>
        <Paper elevation={0} />
        <Paper />
        <Paper elevation={10} style={{ backgroundColor: 'white' }}>
        <CardGroup>
            <Grid container spacing={3}>
            <Grid item xs>
            <Card>
            <Card.Body>
                <Card.Title><h2>BUDGET</h2></Card.Title>
                <Card.Img variant="top"src={img1}  style={{ width: '100px', height: '100px', borderRadius: '50%' }} />
                <Card.Text>
                <h1 style={{ color: 'green' }}>                    
                $ {budgetdisplay}</h1>
                </Card.Text>
            </Card.Body>
            </Card>
            </Grid>
            <Grid item xs>
            <Card>
            <Card.Body>
                <Card.Title><h2>EXPENSES</h2></Card.Title>
                <Card.Img variant="top" src={img2} style={{ width: '100px', height: '100px', borderRadius: '50%' }} />
                <Card.Text>
                <h1 style={{ color: 'red' }}>
                $ {expensesdisplay}</h1>
                </Card.Text>
            </Card.Body>
            </Card>
            </Grid>
            <Grid item xs>
            <Card>
            <Card.Body>
                <Card.Title><h2>BALANCE</h2></Card.Title>
                <Card.Img variant="top" src={img3} style={{ width: '100px', height: '100px', borderRadius: '50%' }} />
                <Card.Text>
                <h1 style={{ color: 'blue' }}>
                $ {balance}</h1>
                </Card.Text>
                </Card.Body>
            </Card>
            </Grid>
            </Grid>
        </CardGroup>
        <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="customized table">
            <TableHead>
            <TableRow>
                <StyledTableCell>ID</StyledTableCell>
                <StyledTableCell align="right">Expense Title</StyledTableCell>
                <StyledTableCell align="right">Expense Value</StyledTableCell>
                <StyledTableCell align="right"> Action </StyledTableCell>
            </TableRow>
            </TableHead>
            <TableBody>
            {userdata.length ? userdata.map((exp, index) =>
            <StyledTableRow key={index}>
                    <StyledTableCell component="th" scope="row">
                    {index}
                    </StyledTableCell>
                    <StyledTableCell align="right">{exp.title}</StyledTableCell>
                    <StyledTableCell align="right">{exp.amount}</StyledTableCell>
                    <StyledTableCell align="right">
                    <Button variant="contained" color="primary" type="submit"  onClick={() => update(index, exp)}    sx={{
                        color:'danger',
                        borderRadius:'20px'
                    }}>
                    <Typography variant="h6" component="div" >
                    <i class="fas fa-edit"></i>
                    </Typography>
                    </Button>&nbsp;&nbsp;    
                    <Button variant="contained" color="error" type="submit"  onClick={() => { deletes(index) }}   sx={{
                        color:'danger',
                        borderRadius:'20px'
                        }} >
                    <Typography variant="h6" component="div" >
                    <i class="fas fa-trash"></i>
                    </Typography>
                    </Button>&nbsp;&nbsp;
                    </StyledTableCell>
            </StyledTableRow>) : <p>No Expense</p>}
            </TableBody>
        </Table>
        </TableContainer>
    </Paper>
    </Box>
    </Item>
    <Item>
    <Link to="/" style={{textDecoration:'none'}}> <Button variant="contained" color="error" type="submit"className="logout" onClick={logout} sx={{
        color:'danger'}} >
    <Typography variant="h6" component="div" >
    Logout
    </Typography>
    </Button></Link>                           
    </Item>
    </Grid>
    </Grid>
    </Box>
</>
    )
}