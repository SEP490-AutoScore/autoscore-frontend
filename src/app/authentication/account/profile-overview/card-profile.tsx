import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const CardProfile = () => {
  return (
    <div className="flex flex-row gap-4">
      <div className="flex w-1/2">
        <Card>
          <CardHeader className="flex items-center justify-center">
            <img
              src="https://img.myloview.cz/nalepky/default-avatar-profile-in-trendy-style-for-social-media-user-icon-400-228654852.jpg"
              alt="Profile"
            />
          </CardHeader>
          <CardContent >
            <CardTitle>John Doe</CardTitle>
            <CardDescription>Software Engineer</CardDescription>
          </CardContent>
        </Card>
      </div>
      <div className="flex flex-col gap-4">
        <Card>
          <CardContent>
            <img
              src="https://img.myloview.cz/nalepky/default-avatar-profile-in-trendy-style-for-social-media-user-icon-400-228654852.jpg"
              alt="Profile"
              className="w-1/2 h-fit"
            />
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <img
              src="https://img.myloview.cz/nalepky/default-avatar-profile-in-trendy-style-for-social-media-user-icon-400-228654852.jpg"
              alt="Profile"
              className="w-1/2 h-fit"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
