from flask import Flask
from flask_cors import CORS, cross_origin

from tempfile import NamedTemporaryFile
import csv, shutil

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

error_message = "<p>Sorry, couldn't make that work.</p>"
filename = 'guests.csv'

@app.route("/search/<string>")
def search(string):
    global error_message

    try:
      variables = string.split('+')
      firstname = variables[0].capitalize()
      lastname = variables[1].capitalize()
      zipcode = variables[2]
    except:
      return 
    
    # check if the name is found in the csv. Check only first three letters
    guest_json = get_guest_json(firstname, lastname, zipcode)
    
    return guest_json

@app.route("/edit/<string>")
def edit(string):
  global error_message

  try:
    variables = string.split('+')
    guest_id = int(variables[0])
    plus_one = variables[1]
  
  except: 
     return error_message
    
  guest_json = get_guest_json(guest_id=guest_id)

  # edit the json to reflect the plus ones
  guest_json['plusOne'] = plus_one

  # save the json to back to the csv
  update_csv(guest_json)

  return guest_json

if __name__ == "__main__":
    app.run(debug=True)

# search through the csv file to find guest based  
# on firstname, lastname, and zipcode.
# 
# return a json object of guest
#   (or empty json if not found)
def get_guest_json(firstname="", lastname="", zipcode="", guest_id=""):  
  global filename
  with open(filename, 'r') as file:
    csv_reader = csv.reader(file)
    first = True

    if guest_id:
       for row in csv_reader:
          if first:
             first = False
             continue
          
          if int(row[0]) == guest_id:
             return get_json_from_row(row)

    for row in csv_reader:
      if firstname[:3] == row[1][:3] and lastname[:3] == row[2][:3] and zipcode == row[3]:
        return get_json_from_row(row)

  return "{}"

# take a row of guest data and build a json dict
def get_json_from_row(row):
   guest_json = {}
   guest_json['guestID'] = row[0]
   guest_json['firstName'] = row[1]
   guest_json['lastName'] = row[2]
   guest_json['zipcode'] = row[3]
   guest_json['plusOne'] = row[4]

   return guest_json

# take some guest_json and update the csv to have that
def update_csv(guest_json):
   global filename

   tempfile = NamedTemporaryFile(mode='w', delete=False)
   
   # would rather grab these automatically
   fields = ['guestID','firstName','lastName','zipcode','plusOne']

   with open(filename, 'r') as csvfile, tempfile:
      reader = csv.DictReader(csvfile, fieldnames=fields)
      writer = csv.DictWriter(tempfile, fieldnames=fields)

      # iterate through rows. if it is the guest_json row,
      # update that row. then write the row to the temp file
      for row in reader:
         if row['guestID'] == guest_json['guestID']:
            print(f"updating row {row['guestID']}")
            row['plusOne'] = guest_json['plusOne']
         
            row = {}
            for field in fields:
                row[field] = guest_json[field]
         
         # idk why None key is getting added, but if it is, drop it
         row.pop(None, None)
          
         writer.writerow(row)  
   
   # move the temp file back to the csv
   shutil.move(tempfile.name, filename)