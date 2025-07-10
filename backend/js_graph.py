from quickchart import QuickChart
import os
import json

qc = QuickChart()
qc.width = 500
qc.height = 300
directory_path = "./test_results"

json_files = [f for f in os.listdir(directory_path) if f.endswith('.json')]
for json_file in json_files:
    file_path = os.path.join(directory_path, json_file)
    with open(file_path, 'r') as file:
        data = json.load(file)
        print(f"Read data from {json_file}: {data}")

        # Ensure the y-axis starts from 0
        if "options" not in data:
            data["options"] = {}
        if "scales" not in data["options"]:
            data["options"]["scales"] = {}
        if "y" not in data["options"]["scales"]:
            data["options"]["scales"]["y"] = {}
        data["options"]["scales"]["y"]["beginAtZero"] = True

        # Generate the URL for the chart
        qc.config = data
        chart_url = qc.get_url()

        # Save the image from the URL
        output_path = os.path.join(directory_path, f"{os.path.splitext(json_file)[0]}.png")
        os.system(f"wget -O {output_path} {chart_url}")
        print(f"Saved chart as {output_path}")

