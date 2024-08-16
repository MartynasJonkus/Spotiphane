import numpy as np
from PIL import Image, ImageOps, ImageEnhance
import trimesh


def combine_images(cover_art_image, spotify_code_image, code_margin):
    ratio = cover_art_image.width / spotify_code_image.width
    height = int(spotify_code_image.height * ratio)
    spotify_code_image = spotify_code_image.resize((cover_art_image.width, height))

    combined_height = cover_art_image.height + spotify_code_image.height
    combined_image = Image.new('RGB', (cover_art_image.width, combined_height))
    combined_image.paste(cover_art_image, (0, 0))
    combined_image.paste(spotify_code_image, (0, cover_art_image.height + code_margin))

    return combined_image


def adjust_image(image, contrast_factor, frame_width, max_width, pixels_per_mm):
    enhancer = ImageEnhance.Contrast(image)
    contrasted_image = enhancer.enhance(contrast_factor)
    gray_image = contrasted_image.convert('L')
    flipped_image = gray_image.transpose(Image.FLIP_LEFT_RIGHT)

    frame_width_in_pixels = int(flipped_image.width * frame_width / (max_width - 2 * frame_width))
    framed_image = ImageOps.expand(flipped_image, frame_width_in_pixels, 'black')

    target_resolution = max_width * pixels_per_mm
    if framed_image.width > target_resolution:
        ratio = target_resolution / framed_image.width
        new_height = int(framed_image.height * ratio)
        resized_image = framed_image.resize((int(target_resolution), new_height))
    
    return resized_image


def image_to_heightmap(image, min_thickness, max_thickness):
    image_array = np.array(image)

    min_pixel = image_array.min()
    max_pixel = image_array.max()
    normalized_array = (image_array - min_pixel) / (max_pixel - min_pixel) * (max_thickness - min_thickness) + min_thickness
    heightmap = max_thickness - (normalized_array - min_thickness)

    return heightmap


def create_3d_model(heightmap, max_width):
    rows, cols = heightmap.shape
    vertices = []
    faces = []

    scale_factor = max_width / cols
    for i in range(rows):
        for j in range(cols):
            vertices.append([j * scale_factor, i * scale_factor, heightmap[i, j]])

    for i in range(rows):
        for j in range(cols):
            vertices.append([j * scale_factor, i * scale_factor, 0])

    def vertex_index(x, y, offset=0):
        return x + y * cols + offset

    for i in range(rows - 1):
        for j in range(cols - 1):
            v1 = vertex_index(j, i)
            v2 = vertex_index(j + 1, i)
            v3 = vertex_index(j, i + 1)
            v4 = vertex_index(j + 1, i + 1)
            
            faces.append([v1, v2, v3])
            faces.append([v3, v2, v4])

    offset = rows * cols
    for i in range(rows - 1):
        for j in range(cols - 1):
            v1 = vertex_index(j, i, offset)
            v2 = vertex_index(j + 1, i, offset)
            v3 = vertex_index(j, i + 1, offset)
            v4 = vertex_index(j + 1, i + 1, offset)
            
            faces.append([v1, v3, v2])
            faces.append([v3, v4, v2])

    for i in range(rows - 1):
        for j in range(cols - 1):
            faces.append([vertex_index(j, i), vertex_index(j, i, offset), vertex_index(j, i + 1)])
            faces.append([vertex_index(j, i + 1), vertex_index(j, i, offset), vertex_index(j, i + 1, offset)])
            
            faces.append([vertex_index(j + 1, i), vertex_index(j + 1, i, offset), vertex_index(j + 1, i + 1)])
            faces.append([vertex_index(j + 1, i + 1), vertex_index(j + 1, i, offset), vertex_index(j + 1, i + 1, offset)])
            
            faces.append([vertex_index(j, i), vertex_index(j, i, offset), vertex_index(j + 1, i)])
            faces.append([vertex_index(j + 1, i), vertex_index(j, i, offset), vertex_index(j + 1, i, offset)])
            
            faces.append([vertex_index(j, i + 1), vertex_index(j, i + 1, offset), vertex_index(j + 1, i + 1)])
            faces.append([vertex_index(j + 1, i + 1), vertex_index(j, i + 1, offset), vertex_index(j + 1, i + 1, offset)])

    vertices = np.array(vertices)
    faces = np.array(faces)
    mesh = trimesh.Trimesh(vertices=vertices, faces=faces)

    return mesh
