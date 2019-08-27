import { Chart, Geom, Axis, Tooltip, Legend, Coord } from 'bizcharts';
import React from 'react';


export default class ColumnarBase extends React.Component {
    static defaultProps = {
        data: [
            { genre: 'Sports', sold: 275, income: 2300 },
            { genre: 'Strategy', sold: 115, income: 667 },
            { genre: 'Action', sold: 120, income: 982 },
            { genre: 'Shooter', sold: 350, income: 5271 },
            { genre: 'Other', sold: 150, income: 3710 }
        ], // 数据源
        cols: { // 度量，列数
            sold: { alias: '销售量' },
            genre: { alias: '游戏种类' }
        },
        width: 600,
        height: 400,
    }
    render() {
        const { props } = this;
        return (
            <Chart width={props.width} height={props.height} data={props.data} scale={props.cols}>
                <Axis name="genre" title/>
                <Axis name="sold" title/>
                <Legend position="top" dy={-20} />
                <Tooltip />
                <Geom type="interval" position="genre*sold" color="genre" />
            </Chart>
        )
    }
}