import { useAuth } from "../contexts/AuthContext";

export default function ProfileAvatar() {
  const { user, updateAvatar } = useAuth();

  function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => updateAvatar(reader.result as string);
    reader.readAsDataURL(file);
  }

  return (
    <div className="flex items-center gap-3">
      <img
        src={user?.avatar || "https://via.placeholder.com/80"}
        className="w-16 h-16 rounded-full object-cover border"
      />

      <label className="text-sm cursor-pointer text-purple-600">
        Alterar foto
        <input type="file" hidden accept="image/*" onChange={handleImage} />
      </label>
    </div>
  );
}
