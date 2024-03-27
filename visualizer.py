import matplotlib.pyplot as plt

def plot_points_from_file(filename, targetname):
    with open(filename, 'r') as file:
        data = eval(file.read())
    
    with open(targetname, 'r') as file:
        target = eval(file.read())

    for points_list in data:
        x = [point[0] for point in points_list]
        y = [point[1] for point in points_list]
        plt.plot(x, y, 'bo')
        
    for target_list in target:
        x = [point[0] for point in target_list]
        y = [point[1] for point in target_list]
        plt.plot(x, y, 'ro')

    plt.xlabel('X')
    plt.ylabel('Y')
    plt.title('Visualization of Points')
    plt.grid(True)
    plt.show()

# Replace 'points_data.txt' with the path to your file
plot_points_from_file('points_data.txt', 'target_data.txt')