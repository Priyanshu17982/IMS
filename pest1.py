import torch
from torchvision import datasets, transforms, models
from torch.utils.data import DataLoader

# Define transformations
transform = transforms.Compose([
    transforms.Resize((224,224)),
    transforms.ToTensor(),
])

# Load dataset
dataset_path = './pesticide_dataset'  # path to your dataset folder
dataset = datasets.ImageFolder(root=dataset_path, transform=transform)

# Data loader
data_loader = DataLoader(dataset, batch_size=32, shuffle=True)

# Example: Load pretrained model and adapt for your classes
model = models.resnet18(pretrained=True)
num_classes = len(dataset.classes)
model.fc = torch.nn.Linear(model.fc.in_features, num_classes)

print(f"Classes: {dataset.classes}")

# Example loop to check data
for images, labels in data_loader:
    print(images.shape, labels.shape)
    break
