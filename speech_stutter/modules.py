from modulefinder import ModuleFinder
f = ModuleFinder()
# Run the main script
f.run_script('app.py')
# Get names of all the imported modules
names = list(f.modules.keys())
print(names)