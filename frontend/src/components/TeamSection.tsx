import { User, Code, BookOpen, Lightbulb } from 'lucide-react';

const TeamSection = () => {
  const teamMembers = [
    {
      name: 'SHUBHAM KUMAR',
      role: 'Project Lead',
      icon: Lightbulb,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      borderColor: 'border-primary/30',
      isLead: true,
    },
    {
      name: 'ASHISH RANJAN',
      role: 'Team Member',
      icon: Code,
      color: 'text-neon-green',
      bgColor: 'bg-neon-green/10',
      borderColor: 'border-neon-green/30',
    },
    {
      name: 'SACHIN KR YADAV',
      role: 'Team Member',
      icon: BookOpen,
      color: 'text-neon-magenta',
      bgColor: 'bg-neon-magenta/10',
      borderColor: 'border-neon-magenta/30',
    },
    {
      name: 'MANIKANT',
      role: 'Team Member',
      icon: Code,
      color: 'text-neon-purple',
      bgColor: 'bg-neon-purple/10',
      borderColor: 'border-neon-purple/30',
    },
  ];

  return (
    <section id="team" className="py-24 relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16 fade-in-up">
          <span className="font-mono text-primary text-sm tracking-wider uppercase mb-4 block">
            [ Team Members ]
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-6">
            Meet Our <span className="gradient-text">Team</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            The talented individuals who contributed to this project.
          </p>
        </div>

        {/* Team Grid */}
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, index) => (
              <div
                key={member.name}
                className={`cyber-card p-6 text-center hover-lift fade-in-up stagger-${index + 1} ${
                  member.isLead ? 'lg:col-span-4 md:col-span-2' : ''
                }`}
              >
                {/* Avatar */}
                <div className={`w-20 h-20 mx-auto rounded-full ${member.bgColor} border-2 ${member.borderColor} flex items-center justify-center mb-4 ${member.isLead ? 'w-24 h-24' : ''}`}>
                  <member.icon className={`${member.isLead ? 'w-10 h-10' : 'w-8 h-8'} ${member.color}`} />
                </div>

                {/* Name */}
                <h3 className={`font-display font-bold mb-1 text-foreground ${member.isLead ? 'text-xl' : 'text-lg'}`}>
                  {member.name}
                </h3>

                {/* Role Badge */}
                <span className={`inline-block px-3 py-1 rounded-full ${member.bgColor} border ${member.borderColor} ${member.color} text-xs font-medium`}>
                  {member.role}
                </span>

                {/* Lead Badge */}
                {member.isLead && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-muted-foreground text-sm">
                      Department of Computer Science & Engineering
                    </p>
                    <p className="text-primary text-sm font-mono mt-1">
                      LNJPIT, Chapra | 7th Semester
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Guide Info */}
          <div className="mt-12 text-center fade-in-up">
            <div className="inline-block cyber-card px-8 py-6">
              <div className="flex items-center justify-center gap-3 mb-3">
                <User className="w-8 h-8 text-neon-green" />
                <span className="font-display text-xl font-bold text-foreground">Project Guide</span>
              </div>
              <p className="text-2xl font-display font-bold text-neon-green neon-text-green">
                SHUDHIR SIR
              </p>
              <p className="text-muted-foreground text-sm mt-2">
                Faculty Advisor, CSE Department
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
