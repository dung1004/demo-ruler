import React, { Component } from 'react';
import dayjs from 'dayjs'

class Test extends Component {
    render() {
        var date = new Date('2020','0','30');
        alert('date: '+ date);
        var newdate = new Date(date);
        newdate.setDate(newdate.getDate() + 4);
        var nd = new Date(newdate);
        alert('after date '+nd);
        return (
            <div>
                asdasd
            </div>
        );
    }
}

export default Test;
