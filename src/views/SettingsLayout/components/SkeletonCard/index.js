import React from "react";
import Skeleton from "react-loading-skeleton";
import {
	Grid,
	Typography,
	ListSubheader,
    ListItemText,
} from '@material-ui/core';
import useStyles from './style';

const SkeletonCard = () => {
    const classes = useStyles()
    return (
      <div className={[classes.paddingLeft50]}>
        <div className={classes.screenTitle}>
            <Skeleton height={30} width={300}/>
        </div>
        <Grid container>
            <Grid container item sm={12} xs={12} justifyContent='space-between' spacing={3}>
                <Grid item sm={6} xs={12} >
                    <Skeleton height={30} width={500}/>
                </Grid>
                <Grid item sm={6} xs={12}>
                    <Skeleton height={30} width={500}/>   
                </Grid>
			</Grid>	
		</Grid>
        <Grid container item sm={12} xs={12} spacing={3} className={classes.topMargin20}>
            <Grid item sm={12} xs={12}>
                <div className={classes.listSection}>
                    <ListSubheader className={classes.listsubheader}>
                        <Skeleton height={36} width={100}/> &nbsp; 	
                        <Skeleton height={36} width={100}/> &nbsp; 
                        <Skeleton height={36} width={100}/> &nbsp;
                        <Skeleton height={36} width={100}/> &nbsp;
                        <Skeleton height={36} width={100}/> &nbsp; 
                        <Skeleton height={36} width={100}/> &nbsp;
                        <Skeleton height={36} width={100}/> &nbsp; 
                        <Skeleton height={36} width={100}/> &nbsp;
                    </ListSubheader> 
                    
                    <Skeleton height={46} width={`100%`}/> &nbsp;
                    <Skeleton height={46} width={`100%`}/> &nbsp;
                    <Skeleton height={46} width={`100%`}/> &nbsp;
                    
                
                    <Grid
                        container item
                        style={{ paddingTop: 20, paddingBottom: 20 }}
                        xs={12}
                        spacing={2}
                        direction='row'
                        justifyContent='flex-end'
                        alignItems='center'
                    >
                        <Grid item>
                            <ListItemText />
                        </Grid>
                        <Grid item>
                            <Skeleton height={10} width={100} />
                        </Grid>
                        <Grid item style={{ width: 100, margin: 15 }}>
                            <Skeleton height={50} width={100}/> &nbsp;
                        </Grid>
                        <Grid item>
                            <Skeleton height={10} width={100} />
                        </Grid>
                    </Grid>
                </div>
            </Grid>
		</Grid>
      </div>
    );
  };

  export default SkeletonCard;

  