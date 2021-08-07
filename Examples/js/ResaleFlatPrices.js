(function () {
    // Create the connector object
    var myConnector = tableau.makeConnector();

    // Define the schema
    myConnector.getSchema = function (schemaCallback) {
        var cols = [
            {
                dataType: tableau.dataTypeEnum.string,
                "id": "month"
            },
            {
                dataType: tableau.dataTypeEnum.string,
                "id": "town"
            },
            {
                dataType: tableau.dataTypeEnum.string,
                "id": "flat_type"
            },
            {
                dataType: tableau.dataTypeEnum.string,
                "id": "block"
            },
            {
                dataType: tableau.dataTypeEnum.string,
                "id": "street_name"
            },
            {
                dataType: tableau.dataTypeEnum.string,
                "id": "storey_range"
            },
            {
                dataType: tableau.dataTypeEnum.float,
                "id": "floor_area_sqm"
            },
            {
                dataType: tableau.dataTypeEnum.string,
                "id": "flat_model"
            },
            {
                dataType: tableau.dataTypeEnum.float,
                "id": "lease_commence_date"
            },
            {
                dataType: tableau.dataTypeEnum.string,
                "id": "remaining_lease"
            },
            {
                dataType: tableau.dataTypeEnum.float,
                "id": "resale_price"
            }
        ];

        var tableSchema = {
            id: "ResaleFlatPrices",
            alias: "Resale flat prices based on registration date from Jan-2017 onwards",
            columns: cols
        };

        schemaCallback([tableSchema]);
    };

    // Download the data
    myConnector.getData = function (table, doneCallback) {
        $.getJSON(`https://data.gov.sg/dataset/7a339d20-3c57-4b11-a695-9348adfd7614/resource/f1765b54-a209-4718-8d38-a39237f502b3/data?limit=2000`, function (resp) {

            var tableData = [];
            for (var rec of resp.records) {
                tableData.push({
                    "month": rec.month,
                    "town": rec.town,
                    "flat_type": rec.flat_type,
                    "block": rec.block,
                    "street_name": rec.street_name,
                    "storey_range": rec.storey_range,
                    "floor_area_sqm": rec.floor_area_sqm,
                    "flat_model": rec.flat_model,
                    "lease_commence_date": rec.lease_commence_date,
                    "remaining_lease": rec.remaining_lease,
                    "resale_price": rec.resale_price
                })
            }

            table.appendRows(tableData);
            doneCallback();
        });
    };

    tableau.registerConnector(myConnector);

    // Create event listeners for when the user submits the form
    $(document).ready(function () {
        $("#submitButton").click(function () {
            tableau.connectionName = "Resale Flat Prices"; // This will be the data source name in Tableau
            tableau.submit(); // This sends the connector object to Tableau
        });
    });

})();