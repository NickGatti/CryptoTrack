$( function () {

    let count = 0
    let data;
    let pullBuysOut = ( passedOrderArray ) => {
        return passedOrderArray.filter( ( ele ) => {
            return ele.side === "buy"
        } )
    }

    let pullSellsOut = ( passedOrderArray ) => {
        return passedOrderArray.filter( ( ele ) => {
            return ele.side === 'sell'
        } )
    }

    let sortLowestToHighest = ( passedOrderArray ) => {
        return passedOrderArray.sort( ( a, b ) => {
            return a.price - b.price
        } )
    }

    let sortHighestToLowest = ( passedOrderArray ) => {
        return passedOrderArray.sort( ( a, b ) => {
            return b.price - a.price
        } )
    }

    var baseUrl = 'https://api.gdax.com//products/ETH-USD/trades';

    var xhr = new XMLHttpRequest()

    xhr.addEventListener( 'load', responseRecieved )

    function getInfo() {
        xhr.open( 'GET', baseUrl )
        xhr.send()
    }

    function responseRecieved() {
        if ( this.status < 200 && this.status >= 400 && this.readyState !== 1 ) {
            console.log( 'Error in API request: ' + this );
            return
        } else {
            data = this
            run()
        }
        setTimeout( getInfo, 2000 )
    }

    let allRows = []
    let moreRows = []

    function run() {
        let orders = JSON.parse( data.responseText )

        let buyOrders = pullBuysOut( orders )
        sortHighestToLowest( buyOrders )

        let sellOrders = pullSellsOut( orders )
        sortLowestToHighest( sellOrders )

        count += 2

        if ( allRows.length === 0 ) {
            allRows.push( [ 0, Number( buyOrders[ 0 ].price * 0.9995 ), Number( sellOrders[ 0 ].price * 0.9995 ) ] )
        } else {
            moreRows = [ count, Number( buyOrders[ 0 ].price ), Number( sellOrders[ 0 ].price ) ]
        }


        google.charts.load( 'current', {
            'packages': [ 'line' ]
        } );
        google.charts.setOnLoadCallback( drawChart );

    }

    function drawChart() {
        if ( moreRows.length !== 0 ) allRows.push( moreRows )

        var data = new google.visualization.DataTable();
        data.addColumn( 'number', 'Time in seconds' );
        data.addColumn( 'number', 'Buys' );
        data.addColumn( 'number', 'Sells' );

        data.addRows( allRows );



        var options = {
            chart: {
                title: 'USD Price of ETH Over Time',
                subtitle: 'updated every two seconds'
            }
        };

        var chart = new google.charts.Line( document.getElementById( 'chart_div' ) );

        chart.draw( data, google.charts.Line.convertOptions( options ) );
    }

    function landingPage() {
        //$( '.page-main' ).empty()

    }

    function dataPage() {
        $( '.page-main' ).empty()
        let mainHead = '<div class="container"><div class="row"><div class="col s10"><div id="chart_div" class="card"></div></div><div class="col s2"><div class="row">'
        let settingComponents = '<div class="col s12 card">Setting</div>'
        let mainFoot = '</div></div></div></div>'
        let fullHTML = mainHead + settingComponents + mainFoot
        $( '.page-main' ).append( fullHTML )
        // getInfo()
    }

    landingPage()
    // dataPage()
} );