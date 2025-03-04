import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Ellipsis from "./Ellipsis";
import delay from "delay";
// Task interface
interface Task {
  id: string;
  name: string;
  createdAt: Date;
}

interface TaskItemProps {
  task: Task;
  onDelete: (id: string) => void;
}

interface NewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (taskName: string) => void;
}

// Main TaskManager Component
const TaskManager: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Simulate API fetch on component mount
  useEffect(() => {
    const fetchTasks = async () => {
      setIsLoading(true);
      // Simulate API delay
      await delay(1500);

      // Mock initial data
      const initialTasks: Task[] = [
        {
          id: "1",
          name: "A Long Long Long Long Long Long Long Long Long Long Long Long Long Long Long Long Long Task",
          createdAt: new Date(),
        },
        { id: "2", name: "Review code changes", createdAt: new Date() },
        { id: "3", name: "Update documentation", createdAt: new Date() },
      ];

      setTasks(initialTasks);
      setFilteredTasks(initialTasks);
      setIsLoading(false);
    };

    fetchTasks();
  }, []);

  // Filter tasks based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredTasks(tasks);
    } else {
      const filtered = tasks.filter((task) =>
        task.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredTasks(filtered);
    }
  }, [searchTerm, tasks]);

  // Handle task creation
  const handleCreateTask = async (taskName: string) => {
    setIsModalOpen(false);

    // Simulate API call
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));

    const newTask: Task = {
      id: Date.now().toString(),
      name: taskName,
      createdAt: new Date(),
    };

    setTasks((prevTasks) => [...prevTasks, newTask]);
    setIsLoading(false);
    toast.success("Task created successfully!");
  };

  // Handle task deletion
  const handleDeleteTask = async (id: string) => {
    // Simulate API call
    setIsLoading(true);
    await delay(600);

    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    setIsLoading(false);
    toast.success("Task deleted successfully!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 p-6 flex justify-center items-start">
      <div className="w-full max-w-2xl">
        {/* Glass morphism card */}
        <div className="backdrop-blur-lg bg-white/70 rounded-2xl shadow-xl border border-white/20 p-6 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 size-40 bg-purple-300 rounded-full opacity-20 blur-2xl"></div>
          <div className="absolute -bottom-20 -left-20 size-40 bg-blue-300 rounded-full opacity-20 blur-2xl"></div>

          {/* Header with title and new task button */}
          <div className="flex justify-between items-center mb-6 relative z-10">
            <h1 className="text-2xl font-bold text-gray-800">My Tasks</h1>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
            >
              <img
                src="https://unpkg.com/lucide-static@latest/icons/plus.svg"
                alt="Add"
                className="size-4 invert"
              />
              New Task
            </button>
          </div>

          {/* Search bar */}
          <div className="relative mb-6 z-10">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <img
                src="https://unpkg.com/lucide-static@latest/icons/search.svg"
                alt="Search"
                className="size-5 text-gray-500"
              />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-4 py-3 bg-white/60 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition-all duration-300"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Task list */}
          {isLoading ? (
            <SkeletonLoader />
          ) : filteredTasks.length > 0 ? (
            <ul className="space-y-3 relative z-10">
              {filteredTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onDelete={handleDeleteTask}
                />
              ))}
            </ul>
          ) : (
            <EmptyState searchTerm={searchTerm} />
          )}
        </div>
      </div>

      {/* New Task Modal */}
      {isModalOpen && (
        <NewTaskModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCreateTask}
        />
      )}
    </div>
  );
};

// Task Item Component
const TaskItem: React.FC<TaskItemProps> = ({ task, onDelete }) => {
  return (
    <li className="bg-white/50 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-white/50 flex justify-between items-center group hover:bg-white/70 transition-all duration-300">
      <Ellipsis className={"text-gray-800 font-medium"}>{task.name}</Ellipsis>
      <button
        onClick={() => onDelete(task.id)}
        className="text-gray-400 hover:text-red-500 transition-colors duration-300"
        aria-label="Delete task"
      >
        <img
          src="https://unpkg.com/lucide-static@latest/icons/trash-2.svg"
          alt="Delete"
          className="min-w-5 min-h-5 size-5"
        />
      </button>
    </li>
  );
};

// New Task Modal Component
const NewTaskModal: React.FC<NewTaskModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [taskName, setTaskName] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (taskName.trim()) {
      onSubmit(taskName);
      setTaskName("");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 w-full max-w-md p-6 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 size-40 bg-indigo-300 rounded-full opacity-20 blur-2xl"></div>

        <h2 className="text-xl font-bold mb-4 text-gray-800">
          Create New Task
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="taskName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Task Name
            </label>
            <input
              id="taskName"
              type="text"
              className="w-full px-4 py-3 bg-white/60 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-300 focus:outline-none transition-all duration-300"
              placeholder="Enter task name"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              autoFocus
            />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!taskName.trim()}
              className={`px-4 py-2 rounded-lg ${
                taskName.trim()
                  ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:shadow-lg"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              } transition-all duration-300`}
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Skeleton Loader Component
const SkeletonLoader: React.FC = () => {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="animate-pulse bg-white/30 rounded-xl p-4 flex justify-between"
        >
          <div className="h-5 bg-gray-200 rounded w-3/4"></div>
          <div className="h-5 w-5 bg-gray-200 rounded"></div>
        </div>
      ))}
    </div>
  );
};

// Empty State Component
const EmptyState: React.FC<{ searchTerm: string }> = ({ searchTerm }) => {
  return (
    <div className="text-center py-10">
      {searchTerm ? (
        <>
          <img
            src="https://unpkg.com/lucide-static@latest/icons/search-x.svg"
            alt="No results"
            className="size-12 mx-auto mb-3 text-gray-400"
          />
          <p className="text-gray-500">
            No tasks found matching "{searchTerm}"
          </p>
        </>
      ) : (
        <>
          <img
            src="https://unpkg.com/lucide-static@latest/icons/clipboard-list.svg"
            alt="Empty list"
            className="size-12 mx-auto mb-3 text-gray-400"
          />
          <p className="text-gray-500">Your task list is empty</p>
          <p className="text-sm text-gray-400 mt-1">
            Create a new task to get started
          </p>
        </>
      )}
    </div>
  );
};

export default TaskManager;
