(function () {
    // Create the connector object
    var myConnector = tableau.makeConnector();

    // Define the schema
    myConnector.getSchema = function (schemaCallback) {
        var cols = [
            {
                id: "street",
                dataType: tableau.dataTypeEnum.string
            },
            {
                id: "x",
                dataType: tableau.dataTypeEnum.float
            },
            {
                id: "project",
                dataType: tableau.dataTypeEnum.string
            },
            {
                id: "y",
                dataType: tableau.dataTypeEnum.float
            },
            {
                id: "area",
                dataType: tableau.dataTypeEnum.float
            },
            {
                id: "floorRange",
                dataType: tableau.dataTypeEnum.string
            },
            {
                id: "noOfUnits",
                dataType: tableau.dataTypeEnum.float
            },
            {
                id: "nettPrice",
                dataType: tableau.dataTypeEnum.float
            },
            {
                id: "contractDate",
                dataType: tableau.dataTypeEnum.float
            },
            {
                id: "typeOfSale",
                dataType: tableau.dataTypeEnum.float
            },
            {
                id: "price",
                dataType: tableau.dataTypeEnum.float
            },
            {
                id: "propertyType",
                dataType: tableau.dataTypeEnum.string
            },
            {
                id: "district",
                dataType: tableau.dataTypeEnum.string
            },
            {
                id: "typeOfArea",
                dataType: tableau.dataTypeEnum.string
            },
            {
                id: "tenure",
                dataType: tableau.dataTypeEnum.string
            },
            {
                id: "marketSegment",
                dataType: tableau.dataTypeEnum.string
            }
        ];

        var tableSchema = {
            id: "PrivateResidentialPropertyTransactions",
            alias: "Past 3 years of private residential property transaction records",
            columns: cols
        };

        schemaCallback([tableSchema]);
    };

    // Download the data
    myConnector.getData = function (table, doneCallback) {
        $.getJSON(`http://localhost:8888/Examples/json/ura.json`, function (resp) {

            var dateObj = JSON.parse(tableau.connectionData)
            var startDate = new Date(dateObj.startDate)
            var endDate = new Date(dateObj.endDate)
            var dates = [];
            var dateCounter = new Date(startDate);
            // avoids edge case where last month is skipped
            dateCounter.setDate(1);
            while (dateCounter < endDate) {
                var month = dateCounter.getMonth() + 1
                month = month < 10 ? `0${month}` : month
                var year = dateCounter.getFullYear().toString().substring(2)
                dates.push(`${month}${year}`);
                dateCounter.setMonth(dateCounter.getMonth() + 1);
            }

            var tableData = [];
            for (var prop of resp) {
                for (var trx of prop.transaction) {
                    if (dates.indexOf(trx.contractDate) > -1) tableData.push({
                        "street": prop.street,
                        "x": prop.x ? prop.x : 0,
                        "project": prop.project,
                        "y": prop.y ? prop.y : 0,
                        "area": trx.area,
                        "floorRange": trx.floorRange,
                        "noOfUnits": trx.noOfUnits,
                        "nettPrice": trx.nettPrice ? trx.nettPrice : 0,
                        "contractDate": trx.contractDate,
                        "typeOfSale": trx.typeOfSale,
                        "price": trx.price,
                        "propertyType": trx.propertyType,
                        "district": trx.district,
                        "typeOfArea": trx.typeOfArea,
                        "tenure": trx.tenure,
                        "marketSegment": prop.marketSegment
                    })
                }
            }

            table.appendRows(tableData);
            doneCallback();
        });
    };

    tableau.registerConnector(myConnector);

    // Create event listeners for when the user submits the form
    $(document).ready(function () {
        $('[id*="-date-one"]').val(new Date().toISOString().substr(0, 10))
        $("#submitButton").click(function () {
            var dateObj = {
                startDate: $('#start-date-one').val().trim(),
                endDate: $('#end-date-one').val().trim(),
            };

            // Simple date validation: Call the getDate function on the date object created
            function isValidDate(dateStr) {
                var d = new Date(dateStr);
                return !isNaN(d.getDate());
            }

            if (isValidDate(dateObj.startDate) && isValidDate(dateObj.endDate)) {
                tableau.connectionData = JSON.stringify(dateObj); // Use this variable to pass data to your getSchema and getData functions
                tableau.connectionName = "Private Residential Property Transactions"; // This will be the data source name in Tableau
                tableau.submit(); // This sends the connector object to Tableau
            } else {
                $('#errorMsg').html("Enter valid dates. For example, 2016-05-08.");
            }
        });
    });

})();