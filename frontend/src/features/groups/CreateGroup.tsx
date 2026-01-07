import { useState } from "react";

const CreateGroup = () => {
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // This is where backend API call will go later
    const formData = new FormData();
    formData.append("groupName", groupName);
    formData.append("description", description);
    if (image) {
      formData.append("image", image);
    }

    console.log("Group Data:", {
      groupName,
      description,
      image,
    });

    alert("Group created (frontend only for now)");
  };

  return (
    <div
      style={{
        maxWidth: 500,
        margin: "40px auto",
        padding: 20,
        border: "1px solid #ddd",
        borderRadius: 8,
      }}
    >
      <h2>Create Group</h2>

      <form onSubmit={handleSubmit}>
        {/* Group Name */}
        <div style={{ marginBottom: 12 }}>
          <label>Group Name</label>
          <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            required
            style={{ width: "100%", padding: 8 }}
          />
        </div>

        {/* Description */}
        <div style={{ marginBottom: 12 }}>
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            style={{ width: "100%", padding: 8 }}
          />
        </div>

        {/* Image Upload */}
        <div style={{ marginBottom: 12 }}>
          <label>Group Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setImage(e.target.files ? e.target.files[0] : null)
            }
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          style={{
            padding: "8px 16px",
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          Create Group
        </button>
      </form>
    </div>
  );
};

export default CreateGroup;
