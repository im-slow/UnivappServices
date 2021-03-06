<?php

namespace App;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Tymon\JWTAuth\Contracts\JWTSubject;
class User extends Authenticatable implements JWTSubject
{
    use Notifiable;

    protected $table = 'users';
    protected $primaryKey = 'id';

    // The attributes that are mass assignable.
    protected $fillable = ['email', 'password', 'role', 'name', 'surname'];

    protected $guarded = ['password'];

    // The attributes that should be hidden for arrays.
    protected $hidden = ['password', 'remember_token', 'created_at', 'updated_at'];

    // TODO protected $appends = ['social'];

    // The attributes that should be cast to native types.
    protected $casts = [ 'email_verified_at' => 'datetime', ];

    // Get the identifier that will be stored in the subject claim of the JWT.
    public function getJWTIdentifier() { return $this->getKey(); }

     // Return a key value array, containing any custom claims to be added to the JWT.
    public function getJWTCustomClaims() { return []; }

    public function roles()
    {
        return $this->belongsToMany(Role::class)
            ->using(RoleUser::class)
            ->withPivot(RoleUser::class)
            ->withTimestamps();
    }

    public function student()
    {
        return $this->hasOne(Student::class);
    }

    public function teacher()
    {
        return $this->hasOne(Teacher::class);
    }

    public function university() {
        return $this->belongsTo(University::class, 'university_id');
    }

    public function sociallink()
    {
        return $this->hasMany(SocialLink::class);
    }

    public function ban()
    {
        return $this->belongsToMany(User::class)
        ->using(Ban::class)
        ->withPivot(Ban::class)
        ->withTimestamps();
    }

    public function report()
    {
        return $this->belongsToMany(User::class)
            ->using(ReportUser::class)
            ->withPivot(ReportUser::class)
            ->withTimestamps();
    }

    public function page()
    {
        return $this->hasMany(Page::class);
    }

    public function purchasednote()
    {
        return $this->belongsToMany(Note::class)
            ->using(PurchasedNote::class)
            ->withPivot(PurchasedNote::class)
            ->withTimestamps();
    }

    public function token()
    {
        return $this->hasOne(Token::class);
    }

    public function upvote()
    {
        return $this->belongsToMany(Note::class)
            ->using(Upvote::class)
            ->withPivot(Upvote::class)
            ->withTimestamps();
    }

    public function downvote()
    {
        return $this->belongsToMany(Note::class)
            ->using(Downvote::class)
            ->withPivot(Downvote::class)
            ->withTimestamps();
    }

    public function reportnote()
    {
        return $this->belongsToMany(Note::class)
            ->using(ReportNote::class)
            ->withPivot(ReportNote::class)
            ->withTimestamps();
    }

    public function desk()
    {
        return $this->belongsToMany(Desk::class)
            ->using(DeskUser::class)
            ->withPivot(DeskUser::class)
            ->withTimestamps();
    }

    public function classroom()
    {
        return $this->belongsToMany(Classroom::class)
            ->using(ClassroomUser::class)
            ->withPivot(Classroom::class)
            ->withTimestamps();
    }

    public function room()
    {
        return $this->belongsToMany(Room::class)
            ->using(RoomUser::class)
            ->withPivot(RoomUser::class)
            ->withTimestamps();
    }

    // TODO OuterKey
    /*
    public function rooms() {
        return $this->belongsToMany(Room::class, 'room_members', 'user_id', 'room_id', 'id', 'id');
    }

    public function social() {
        return $this->hasMany(Social::class, 'user_id', 'id');
    }

    public function getUniversityId()
    {
        if($this->type === 1) {
            $faculty = Faculty::find($this->faculty_id);
            $department = Department::find($faculty->department_id);
            $university = University::find($department->university_id);
            return $university->id;
        } else {
            return $this->university_id;
        }
    }

    public function getDepartmentId()
    {
        $faculty = Faculty::find($this->faculty_id);
        $department = Department::find($faculty->department_id);
        return $department->id;
    }

    public function getSocialAttribute() {
        $social = $this->social()->get();
        return $social;
    }

    static public function getFullName($user_id) {
        $user = User::find($user_id);
        return $user->name . ' ' . $user->surname;
    }
    */
}
