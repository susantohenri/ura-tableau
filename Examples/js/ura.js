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
                id: "project",
                dataType: tableau.dataTypeEnum.string
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
            var tableData = [];
            for (var prop of resp) {
                for (var trx of prop.transaction) {
                    tableData.push({
                        "street": prop.street,
                        "project": prop.project,
                        "area": trx.area,
                        "floorRange": trx.floorRange,
                        "noOfUnits": trx.noOfUnits,
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
        $("#submitButton").click(function () {
            tableau.connectionName = "Private Residential Property Transactions"; // This will be the data source name in Tableau
            tableau.submit(); // This sends the connector object to Tableau
        });
    });
})();